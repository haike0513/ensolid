import { Command } from "commander";
import prompts from "prompts";
import path from "path";
import fs from "fs-extra";
import chalk from "chalk";
import ora from "ora";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// In development, we can find the source relative to the CLI package
// In production, we'd fetch from a URL.
const getSourceDir = () => {
  // Try to find the root of the monorepo
  let current = __dirname;
  while (current !== "/" && !fs.existsSync(path.join(current, "pnpm-workspace.yaml"))) {
    current = path.dirname(current);
  }
  
  const sourcePath = path.join(current, "src/components/ui");
  if (fs.existsSync(sourcePath)) {
    return sourcePath;
  }
  return null;
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

    const sourceDir = getSourceDir();
    if (!sourceDir) {
        console.log(chalk.red("Error: Could not find component sources."));
        return;
    }

    // 2. If no components specified, prompt user
    let selectedComponents = components;
    if (!selectedComponents || selectedComponents.length === 0) {
      const files = await fs.readdir(sourceDir);
      const availableComponents = files
        .filter(f => f.endsWith(".tsx") && f !== "index.tsx")
        .map(f => f.replace(".tsx", ""));

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

    // 3. Copy components
    const spinner = ora("Adding components...").start();

    try {
      if (!fs.existsSync(targetDir)) {
        await fs.ensureDir(targetDir);
      }

      for (const component of selectedComponents) {
        const sourcePath = path.resolve(sourceDir, `${component}.tsx`);
        const destPath = path.resolve(targetDir, `${component}.tsx`);

        if (fs.existsSync(sourcePath)) {
          let content = await fs.readFile(sourcePath, "utf-8");
          
          // Basic dependency handling: if it imports from ./utils, we might need to adjust alias
          // In shadcn, they replace imports with configured aliases.
          // For now, let's just copy.
          
          await fs.writeFile(destPath, content);
          spinner.succeed(`Added ${chalk.blue(component)}`);
        } else {
          spinner.fail(`Component ${chalk.red(component)} not found at ${sourcePath}`);
        }
      }

      // Also copy utils.ts if it doesn't exist
      const utilsSource = path.resolve(sourceDir, "utils.ts");
      const utilsDest = path.resolve(process.cwd(), config.aliases.utils);
      if (fs.existsSync(utilsSource) && !fs.existsSync(utilsDest)) {
          await fs.ensureDir(path.dirname(utilsDest));
          await fs.copy(utilsSource, utilsDest);
          console.log(chalk.green(`\nCreated utils file at ${config.aliases.utils}`));
      }

    } catch (error) {
      spinner.stop();
      console.error(chalk.red("Error adding components:"), error);
    }
  });
