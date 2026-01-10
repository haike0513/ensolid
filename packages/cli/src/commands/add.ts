import { Command } from "commander";
import prompts from "prompts";
import path from "path";
import fs from "fs-extra";
import chalk from "chalk";
import ora from "ora";
import fetch from "node-fetch";

// Helper to convert GitHub tree URL to raw URL base
// Input: https://github.com/haike0513/ensolid/tree/main/src/components/ui
// Output: https://raw.githubusercontent.com/haike0513/ensolid/main/src/components/ui
const getRawUrlBase = (githubUrl: string) => {
  return githubUrl
    .replace("github.com", "raw.githubusercontent.com")
    .replace("/tree/", "/");
};

export const add = new Command()
  .name("add")
  .description("Add a component to your project")
  .argument("[components...]", "the components to add")
  .action(async (components) => {
    // 1. Check if ensolid.json exists
    const configPath = path.resolve(process.cwd(), "ensolid.json");
    if (!fs.existsSync(configPath)) {
      console.log(chalk.red("Error: ensolid.json not found. Please run 'ensolid init' first."));
      return;
    }

    const config = await fs.readJSON(configPath);
    const targetDir = path.resolve(process.cwd(), config.aliases.ui || "src/components/ui");
    const registry = config.registry || "https://github.com/haike0513/ensolid/tree/main/src/components/ui";
    
    const rawBaseUrl = getRawUrlBase(registry);
    console.log(chalk.blue(`Using registry: ${registry}`));

    // 2. If no components specified, prompt user
    let selectedComponents = components;
    if (!selectedComponents || selectedComponents.length === 0) {
      // For now, we manually list available components since fetching directory structure from GitHub requires API
      // In a real implementation, you'd fetch a registry.json file first.
      const availableComponents = [
        "button", "card", "dialog", "checkbox", "switch", "tabs", "accordion",
        "input", "label", "separator", "alert-dialog", "popover", "dropdown-menu",
        "tooltip", "select", "slider", "progress", "toggle", "avatar"
      ];

      const response = await prompts({
        type: "multiselect",
        name: "components",
        message: "Which components would you like to add?",
        choices: availableComponents.map(c => ({ title: c, value: c })),
      });
      selectedComponents = response.components;
    }

    if (!selectedComponents || selectedComponents.length === 0) {
      return;
    }

    // 3. Download components
    const spinner = ora("Downloading components...").start();

    try {
      if (!fs.existsSync(targetDir)) {
        await fs.ensureDir(targetDir);
      }

      for (const component of selectedComponents) {
        const fileUrl = `${rawBaseUrl}/${component}.tsx`;
        const destPath = path.resolve(targetDir, `${component}.tsx`);

        spinner.text = `Downloading ${chalk.blue(component)}...`;
        
        const response = await fetch(fileUrl);
        if (response.ok) {
          const content = await response.text();
          await fs.writeFile(destPath, content);
          spinner.succeed(`Added ${chalk.blue(component)}`);
          spinner.start(); // Restart for next component
        } else {
          spinner.fail(`Failed to download ${chalk.red(component)} from ${fileUrl} (Status: ${response.status})`);
          spinner.start();
        }
      }

      // Also handle utils.ts if it's missing
      const utilsDest = path.resolve(process.cwd(), config.aliases.utils);
      if (!fs.existsSync(utilsDest)) {
          spinner.text = "Downloading utils.ts...";
          const utilsUrl = `${rawBaseUrl}/utils.ts`;
          const response = await fetch(utilsUrl);
          if (response.ok) {
              const content = await response.text();
              await fs.ensureDir(path.dirname(utilsDest));
              await fs.writeFile(utilsDest, content);
              spinner.succeed(`Created utils file at ${config.aliases.utils}`);
          }
      }

      spinner.stop();
      console.log(chalk.green("\nDone! Components have been added to your project."));

    } catch (error) {
      spinner.stop();
      console.error(chalk.red("Error fetching components:"), error);
    }
  });
