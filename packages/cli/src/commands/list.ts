import { Command } from "commander";
import path from "path";
import fs from "fs-extra";
import chalk from "chalk";
import ora from "ora";
import { getConfig } from "../utils/get-config";
import { getRegistryIndex } from "../utils/registry";

export const list = new Command()
  .name("list")
  .alias("ls")
  .description("List available components from the registry")
  .option("-i, --installed", "show only installed components", false)
  .option("-a, --available", "show only available (not installed) components", false)
  .option("-c, --cwd <cwd>", "the working directory. defaults to current directory.", process.cwd())
  .action(async (options) => {
    try {
      const cwd = path.resolve(options.cwd);

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

      const spinner = ora("Fetching components...").start();

      // Get registry index
      let registryIndex;
      try {
        registryIndex = await getRegistryIndex(config.registry);
      } catch (error) {
        spinner.fail("Failed to fetch registry");
        console.error(chalk.red((error as Error).message));
        process.exit(1);
      }

      // Get installed components
      const uiDir = resolveAliasToPath(config.aliases.ui || config.aliases.components, cwd);
      const installedComponents = new Set<string>();

      if (fs.existsSync(uiDir)) {
        const files = await fs.readdir(uiDir);
        files
          .filter((file) => file.endsWith(".tsx") || file.endsWith(".jsx"))
          .forEach((file) => {
            installedComponents.add(file.replace(/\.(tsx|jsx)$/, ""));
          });
      }

      spinner.succeed(`Found ${registryIndex.length} components in registry`);
      console.log("");

      // Prepare display data
      interface ComponentDisplay {
        name: string;
        installed: boolean;
        description?: string;
        dependencies?: string[];
      }

      const components: ComponentDisplay[] = registryIndex.map((item) => ({
        name: item.name,
        installed: installedComponents.has(item.name),
        description: item.description,
        dependencies: item.dependencies,
      }));

      // Filter based on options
      let filteredComponents = components;
      if (options.installed) {
        filteredComponents = components.filter((c) => c.installed);
      } else if (options.available) {
        filteredComponents = components.filter((c) => !c.installed);
      }

      if (filteredComponents.length === 0) {
        if (options.installed) {
          console.log(chalk.dim("No components installed yet."));
          console.log(chalk.dim("Run `npx @ensolid/cli add <component>` to install."));
        } else if (options.available) {
          console.log(chalk.green("All components are installed!"));
        }
        return;
      }

      // Display components in a nice format
      const installed = filteredComponents.filter((c) => c.installed);
      const available = filteredComponents.filter((c) => !c.installed);

      if (!options.available && installed.length > 0) {
        console.log(chalk.green.bold("Installed Components:"));
        displayComponentList(installed);
        console.log("");
      }

      if (!options.installed && available.length > 0) {
        console.log(chalk.blue.bold("Available Components:"));
        displayComponentList(available);
        console.log("");
      }

      // Summary
      console.log(chalk.dim(`Total: ${registryIndex.length} | Installed: ${installedComponents.size} | Available: ${registryIndex.length - installedComponents.size}`));

    } catch (error) {
      console.error(chalk.red("An error occurred:"), (error as Error).message);
      process.exit(1);
    }
  });

function displayComponentList(components: { name: string; installed: boolean; description?: string }[]) {
  // Calculate column width
  const maxNameLength = Math.max(...components.map((c) => c.name.length));
  
  components.forEach((component) => {
    const icon = component.installed ? chalk.green("✓") : chalk.dim("○");
    const name = component.name.padEnd(maxNameLength + 2);
    const desc = component.description ? chalk.dim(component.description) : "";
    console.log(`  ${icon} ${name}${desc}`);
  });
}

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
