import { Command } from "commander";
import prompts from "prompts";
import path from "path";
import fs from "fs-extra";
import chalk from "chalk";
import ora from "ora";
import { execa } from "execa";
import { getConfig } from "../utils/get-config";
import { 
  getRegistryIndex, 
  getRegistryItemWithContent, 
  resolveRegistryDependencies,
  type RegistryItemWithContent 
} from "../utils/registry";
import { getPackageManager, getInstallCommand, getDevFlag } from "../utils/get-package-manager";
import { transformImportPaths } from "../utils/transformers";
import type { Config, RegistryItem } from "../types";

export const add = new Command()
  .name("add")
  .description("Add a component to your project")
  .argument("[components...]", "the components to add")
  .option("-y, --yes", "skip confirmation prompt.", false)
  .option("-o, --overwrite", "overwrite existing files.", false)
  .option("-a, --all", "add all available components.", false)
  .option("-p, --path <path>", "the path to add the component to.")
  .option("-c, --cwd <cwd>", "the working directory. defaults to current directory.", process.cwd())
  .action(async (components: string[], options) => {
    try {
      const cwd = path.resolve(options.cwd);

      if (!fs.existsSync(cwd)) {
        console.error(chalk.red(`The path ${cwd} does not exist.`));
        process.exit(1);
      }

      const config = await getConfig(cwd);
      if (!config) {
        console.log(
          chalk.red(
            `Configuration not found. Please run ${chalk.bold(
              "npx @ensolid/cli init"
            )} to create a ensolid.json file.`
          )
        );
        process.exit(1);
      }

      const spinner = ora("Fetching registry...").start();
      const registryUrl = config.registry;
      
      let registryIndex;
      try {
        registryIndex = await getRegistryIndex(registryUrl);
        spinner.succeed(`Found ${registryIndex.length} components`);
      } catch (error) {
        spinner.fail("Failed to fetch registry");
        console.error(chalk.red((error as Error).message));
        process.exit(1);
      }

      let selectedComponents = components;

      // Add all components
      if (options.all) {
        selectedComponents = registryIndex.map((entry) => entry.name);
      }

      // Interactive component selection
      if (!selectedComponents || selectedComponents.length === 0) {
        const response = await prompts({
          type: "autocompleteMultiselect",
          name: "components",
          message: "Which components would you like to add?",
          hint: "Space to select, Enter to confirm",
          choices: registryIndex.map((entry) => ({
            title: entry.name,
            value: entry.name,
            description: entry.description,
          })),
          instructions: false,
        });
        selectedComponents = response.components;
      }

      if (!selectedComponents || selectedComponents.length === 0) {
        console.log(chalk.cyan("No components selected. Exiting."));
        process.exit(0);
      }

      // Validate selected components
      const invalidComponents = selectedComponents.filter(
        (name) => !registryIndex.some((entry) => entry.name === name)
      );

      if (invalidComponents.length > 0) {
        console.log(
          chalk.yellow(
            `Warning: The following components were not found: ${invalidComponents.join(", ")}`
          )
        );
        selectedComponents = selectedComponents.filter(
          (name) => !invalidComponents.includes(name)
        );
      }

      spinner.start("Resolving dependencies...");

      // Resolve all dependencies
      const allItems = await resolveRegistryDependencies(registryUrl, selectedComponents);
      const componentNames = allItems.map((item) => item.name);
      
      spinner.succeed(`Resolved ${allItems.length} component(s): ${componentNames.join(", ")}`);

      // Collect all npm dependencies
      const dependencies = new Set<string>();
      const devDependencies = new Set<string>();
      
      allItems.forEach((item) => {
        item.dependencies?.forEach((dep) => dependencies.add(dep));
        item.devDependencies?.forEach((dep) => devDependencies.add(dep));
      });

      // Install npm dependencies
      if (dependencies.size > 0 || devDependencies.size > 0) {
        const packageManager = await getPackageManager(cwd);
        const installCmd = getInstallCommand(packageManager);
        const devFlag = getDevFlag(packageManager);

        if (dependencies.size > 0) {
          spinner.start(`Installing ${dependencies.size} dependencies...`);
          try {
            await execa(packageManager, [installCmd, ...Array.from(dependencies)], { cwd });
            spinner.succeed("Dependencies installed");
          } catch (error) {
            spinner.fail("Failed to install dependencies");
            console.log(chalk.dim(`You can install them manually:`));
            console.log(chalk.dim(`  ${packageManager} ${installCmd} ${Array.from(dependencies).join(" ")}`));
          }
        }

        if (devDependencies.size > 0) {
          spinner.start(`Installing ${devDependencies.size} dev dependencies...`);
          try {
            await execa(packageManager, [installCmd, devFlag, ...Array.from(devDependencies)], { cwd });
            spinner.succeed("Dev dependencies installed");
          } catch (error) {
            spinner.fail("Failed to install dev dependencies");
            console.log(chalk.dim(`You can install them manually:`));
            console.log(chalk.dim(`  ${packageManager} ${installCmd} ${devFlag} ${Array.from(devDependencies).join(" ")}`));
          }
        }
      }

      // Download and write files
      spinner.start("Adding components...");
      const addedFiles: string[] = [];
      const skippedFiles: string[] = [];

      for (const item of allItems) {
        try {
          const itemWithContent = await getRegistryItemWithContent(registryUrl, item.name);
          const results = await writeComponentFiles(
            itemWithContent,
            config,
            cwd,
            options.overwrite,
            options.yes,
            options.path
          );
          addedFiles.push(...results.added);
          skippedFiles.push(...results.skipped);
        } catch (error) {
          spinner.warn(`Failed to add ${item.name}: ${(error as Error).message}`);
        }
      }

      spinner.succeed("Components added");

      // Summary
      console.log("");
      if (addedFiles.length > 0) {
        console.log(chalk.green(`✓ Added ${addedFiles.length} file(s):`));
        addedFiles.forEach((file) => console.log(chalk.dim(`  - ${file}`)));
      }
      if (skippedFiles.length > 0) {
        console.log(chalk.yellow(`⊘ Skipped ${skippedFiles.length} file(s):`));
        skippedFiles.forEach((file) => console.log(chalk.dim(`  - ${file}`)));
      }
      console.log("");

    } catch (error) {
      console.error(chalk.red("An error occurred:"), (error as Error).message);
      process.exit(1);
    }
  });

async function writeComponentFiles(
  item: RegistryItemWithContent,
  config: Config,
  cwd: string,
  overwrite: boolean,
  skipPrompts: boolean,
  customPath?: string
): Promise<{ added: string[]; skipped: string[] }> {
  const added: string[] = [];
  const skipped: string[] = [];

  // Determine target directory
  let targetDir: string;
  
  if (customPath) {
    targetDir = path.resolve(cwd, customPath);
  } else if (item.type === "components:ui" && config.aliases.ui) {
    targetDir = resolveAliasToPath(config.aliases.ui, cwd);
  } else {
    targetDir = resolveAliasToPath(config.aliases.components, cwd);
  }

  await fs.ensureDir(targetDir);

  for (const [filePath, content] of item.content) {
    const fileName = path.basename(filePath);
    
    // Convert .tsx to .jsx if not using TypeScript
    const finalFileName = !config.tsx && fileName.endsWith(".tsx")
      ? fileName.replace(".tsx", ".jsx")
      : fileName;
    
    const targetPath = path.resolve(targetDir, finalFileName);
    const relativePath = path.relative(cwd, targetPath);

    // Check if file exists
    if (fs.existsSync(targetPath) && !overwrite) {
      if (skipPrompts) {
        skipped.push(relativePath);
        continue;
      }

      const response = await prompts({
        type: "confirm",
        name: "overwrite",
        message: `File ${chalk.bold(relativePath)} already exists. Overwrite?`,
        initial: false,
      });

      if (!response.overwrite) {
        skipped.push(relativePath);
        continue;
      }
    }

    // Transform import paths
    let transformedContent = transformImportPaths(content, config);
    
    // TODO: Add TypeScript to JavaScript transformation if needed
    // if (!config.tsx) {
    //   transformedContent = transformTsToJs(transformedContent);
    // }

    await fs.writeFile(targetPath, transformedContent);
    added.push(relativePath);
  }

  return { added, skipped };
}

/**
 * Resolve an alias path to an actual file system path
 */
function resolveAliasToPath(aliasPath: string, cwd: string): string {
  const patterns = [
    { prefix: "@/", base: "src" },
    { prefix: "~/", base: "src" },
    { prefix: "$/", base: "src" },
  ];

  for (const pattern of patterns) {
    if (aliasPath.startsWith(pattern.prefix)) {
      return path.resolve(cwd, pattern.base, aliasPath.slice(pattern.prefix.length));
    }
  }

  return path.resolve(cwd, aliasPath);
}
