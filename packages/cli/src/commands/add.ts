import { Command } from "commander";
import prompts from "prompts";
import path from "path";
import fs from "fs-extra";
import chalk from "chalk";
import ora from "ora";
import fetch from "node-fetch";
import { execa } from "execa";
import { getConfig } from "../utils/get-config";
import { getRegistryIndex, getRegistryItem, getRawUrlBase } from "../utils/registry";
import { getPackageManager } from "../utils/get-package-manager";

export const add = new Command()
  .name("add")
  .description("Add a component to your project")
  .argument("[components...]", "the components to add")
  .option("-y, --yes", "skip confirmation prompt.", false)
  .option("-o, --overwrite", "overwrite existing files.", false)
  .option("-c, --cwd <cwd>", "the working directory. defaults to current directory.", process.cwd())
  .action(async (components: string[], options: any) => {
    try {
      const cwd = path.resolve(options.cwd);

      if (!fs.existsSync(cwd)) {
        console.error(`The path ${cwd} does not exist.`);
        process.exit(1);
      }

      const config = await getConfig(cwd);
      if (!config) {
        console.log(
          chalk.red(
            `Configuration not found. Please run ${chalk.bold(
              "init"
            )} to create a ensolid.json file.`
          )
        );
        process.exit(1);
      }

      const registryUrl = config.registry;
      const registryIndex = await getRegistryIndex(registryUrl);

      let selectedComponents = components;
      if (!selectedComponents || selectedComponents.length === 0) {
        const response = await prompts({
          type: "multiselect",
          name: "components",
          message: "Which components would you like to add?",
          choices: registryIndex.map((entry) => ({
            title: entry.name,
            value: entry.name,
          })),
        });
        selectedComponents = response.components;
      }

      if (!selectedComponents || selectedComponents.length === 0) {
        console.log(chalk.cyan("No components selected. Exiting."));
        process.exit(0);
      }

      const spinner = ora(`Resolving dependencies...`).start();

      const registryItems: any[] = [];
      const resolvedComponents = new Set<string>();

      async function resolveDependencies(componentNames: string[]) {
        for (const name of componentNames) {
          if (resolvedComponents.has(name)) continue;
          resolvedComponents.add(name);

          const item = await getRegistryItem(registryUrl, name);
          registryItems.push(item);

          if (item.registryDependencies) {
            await resolveDependencies(item.registryDependencies);
          }
        }
      }

      await resolveDependencies(selectedComponents);

      const dependencies = new Set<string>();
      registryItems.forEach((item) => {
        item.dependencies?.forEach((dep: string) => dependencies.add(dep));
      });

      spinner.succeed();

      // 2. Install dependencies
      if (dependencies.size > 0) {
        const packageManager = await getPackageManager(cwd);
        spinner.start(`Installing dependencies...`);
        await execa(
          packageManager,
          [
            packageManager === "yarn" ? "add" : "install",
            ...Array.from(dependencies),
          ],
          {
            cwd,
          }
        );
        spinner.succeed();
      }

      // 3. Download files
      for (const item of registryItems) {
        spinner.start(`Adding ${item.name}...`);
        
        let targetDir = path.resolve(
          cwd,
          config.aliases.components || "src/components"
        );

        if (item.type === "components:ui" && config.aliases.ui) {
          targetDir = path.resolve(cwd, config.aliases.ui);
        }

        if (!fs.existsSync(targetDir)) {
          await fs.ensureDir(targetDir);
        }

        const rawBaseUrl = getRawUrlBase(registryUrl);

        for (const file of item.files) {
          // If file is just a filename, it's easy.
          // If it's a path like "ui/button.tsx", we might want to preserve structure or flat it.
          // Shadcn/ui usually flattens into the target dir if it's a simple component.
          const fileName = path.basename(file);
          const targetPath = path.resolve(targetDir, fileName);

          if (fs.existsSync(targetPath) && !options.overwrite) {
            const response = await prompts({
              type: "confirm",
              name: "overwrite",
              message: `File ${fileName} already exists. Overwrite?`,
              initial: false,
            });

            if (!response.overwrite) {
              continue;
            }
          }

          // Fetch the actual file content
          // The registry item 'files' should probably point to a relative path from the registry root
          const fileUrl = `${rawBaseUrl}/${file}`;
          const response = await fetch(fileUrl);
          if (!response.ok) {
            spinner.fail(`Failed to fetch ${file} from ${fileUrl}`);
            continue;
          }

          const content = await response.text();
          await fs.writeFile(targetPath, content);
        }
        spinner.succeed(`Added ${item.name}`);
      }

      console.log(chalk.green("\nSuccess! Components added."));
    } catch (error) {
      console.error(chalk.red(error));
      process.exit(1);
    }
  });
