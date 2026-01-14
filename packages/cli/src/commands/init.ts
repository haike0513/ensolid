import { Command } from "commander";
import prompts from "prompts";
import path from "path";
import fs from "fs-extra";
import chalk from "chalk";
import ora from "ora";
import { execa } from "execa";
import { configSchema, DEFAULT_CONFIG, DEFAULT_REGISTRY_URL, type Config } from "../types";
import { getProjectInfo, hasSolidJs } from "../utils/get-project-info";
import { getPackageManager, getInstallCommand } from "../utils/get-package-manager";
import { isRegistryAccessible } from "../utils/registry";

const UTILS_TEMPLATE = `import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
`;

const UTILS_TEMPLATE_JS = `import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}
`;

const CSS_VARIABLES = `@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
  :root {
    --background: 0 0% 100%;
    --foreground: 222.2 84% 4.9%;
    --card: 0 0% 100%;
    --card-foreground: 222.2 84% 4.9%;
    --popover: 0 0% 100%;
    --popover-foreground: 222.2 84% 4.9%;
    --primary: 221.2 83.2% 53.3%;
    --primary-foreground: 210 40% 98%;
    --secondary: 210 40% 96.1%;
    --secondary-foreground: 222.2 47.4% 11.2%;
    --muted: 210 40% 96.1%;
    --muted-foreground: 215.4 16.3% 46.9%;
    --accent: 210 40% 96.1%;
    --accent-foreground: 222.2 47.4% 11.2%;
    --destructive: 0 84.2% 60.2%;
    --destructive-foreground: 210 40% 98%;
    --border: 214.3 31.8% 91.4%;
    --input: 214.3 31.8% 91.4%;
    --ring: 221.2 83.2% 53.3%;
    --radius: 0.5rem;
  }

  .dark {
    --background: 222.2 84% 4.9%;
    --foreground: 210 40% 98%;
    --card: 222.2 84% 4.9%;
    --card-foreground: 210 40% 98%;
    --popover: 222.2 84% 4.9%;
    --popover-foreground: 210 40% 98%;
    --primary: 217.2 91.2% 59.8%;
    --primary-foreground: 222.2 47.4% 11.2%;
    --secondary: 217.2 32.6% 17.5%;
    --secondary-foreground: 210 40% 98%;
    --muted: 217.2 32.6% 17.5%;
    --muted-foreground: 215 20.2% 65.1%;
    --accent: 217.2 32.6% 17.5%;
    --accent-foreground: 210 40% 98%;
    --destructive: 0 62.8% 30.6%;
    --destructive-foreground: 210 40% 98%;
    --border: 217.2 32.6% 17.5%;
    --input: 217.2 32.6% 17.5%;
    --ring: 224.3 76.3% 48%;
  }
}

@layer base {
  * {
    @apply border-border;
  }
  body {
    @apply bg-background text-foreground;
  }
}
`;

export const init = new Command()
  .name("init")
  .description("Initialize your project and install dependencies")
  .option("-y, --yes", "skip confirmation prompt.", false)
  .option("-d, --defaults", "use default configuration.", false)
  .option("-f, --force", "force overwrite of existing configuration.", false)
  .option("-c, --cwd <cwd>", "the working directory. defaults to current directory.", process.cwd())
  .action(async (options) => {
    const cwd = path.resolve(options.cwd);

    console.log(chalk.cyan("\n  Welcome to Ensolid CLI!\n"));

    if (!fs.existsSync(cwd)) {
      console.error(chalk.red(`The path ${cwd} does not exist.`));
      process.exit(1);
    }

    // Check if SolidJS is installed
    const hasSolid = await hasSolidJs(cwd);
    if (!hasSolid) {
      console.log(chalk.yellow("Warning: solid-js is not detected in your project."));
      console.log(chalk.yellow("Make sure you're in a SolidJS project directory.\n"));
    }

    const configPath = path.resolve(cwd, "ensolid.json");

    if (fs.existsSync(configPath) && !options.force) {
      const response = await prompts({
        type: "confirm",
        name: "overwrite",
        message: `${chalk.bold("ensolid.json")} already exists. Overwrite?`,
        initial: false,
      });

      if (!response.overwrite) {
        console.log(chalk.cyan("Configuration not changed."));
        process.exit(0);
      }
    }

    const spinner = ora("Detecting project configuration...").start();
    const projectInfo = await getProjectInfo(cwd);
    spinner.succeed("Project detected");

    console.log(chalk.dim(`  Framework: ${projectInfo.framework.name}`));
    console.log(chalk.dim(`  TypeScript: ${projectInfo.isTsx ? "Yes" : "No"}`));
    console.log(chalk.dim(`  Alias: ${projectInfo.aliasPrefix}`));
    if (projectInfo.tailwindConfigFile) {
      console.log(chalk.dim(`  Tailwind Config: ${projectInfo.tailwindConfigFile}`));
    }
    if (projectInfo.tailwindCssFile) {
      console.log(chalk.dim(`  Tailwind CSS: ${projectInfo.tailwindCssFile}`));
    }
    console.log("");

    let config: Config;

    if (options.defaults) {
      // Use default configuration
      config = {
        ...DEFAULT_CONFIG,
        $schema: "https://ensolid.dev/schema.json",
        registry: DEFAULT_REGISTRY_URL,
        tsx: projectInfo.isTsx,
        tailwind: {
          config: projectInfo.tailwindConfigFile || "tailwind.config.js",
          css: projectInfo.tailwindCssFile || "src/index.css",
          baseColor: "slate",
          cssVariables: true,
        },
        aliases: {
          components: `${projectInfo.aliasPrefix}/components`,
          utils: `${projectInfo.aliasPrefix}/lib/utils`,
          ui: `${projectInfo.aliasPrefix}/components/ui`,
          lib: `${projectInfo.aliasPrefix}/lib`,
          hooks: `${projectInfo.aliasPrefix}/hooks`,
        },
      } as Config;
    } else {
      // Interactive configuration
      const response = await prompts([
        {
          type: "toggle",
          name: "typescript",
          message: "Would you like to use TypeScript?",
          initial: projectInfo.isTsx,
          active: "yes",
          inactive: "no",
        },
        {
          type: "text",
          name: "tailwindConfig",
          message: "Where is your Tailwind config file?",
          initial: projectInfo.tailwindConfigFile || "tailwind.config.js",
        },
        {
          type: "text",
          name: "tailwindCss",
          message: "Where is your global CSS file?",
          initial: projectInfo.tailwindCssFile || "src/index.css",
        },
        {
          type: "toggle",
          name: "cssVariables",
          message: "Would you like to use CSS variables for colors?",
          initial: true,
          active: "yes",
          inactive: "no",
        },
        {
          type: "select",
          name: "baseColor",
          message: "Which base color would you like?",
          choices: [
            { title: "Slate", value: "slate" },
            { title: "Gray", value: "gray" },
            { title: "Zinc", value: "zinc" },
            { title: "Neutral", value: "neutral" },
            { title: "Stone", value: "stone" },
          ],
          initial: 0,
        },
        {
          type: "text",
          name: "components",
          message: "Configure the import alias for components:",
          initial: `${projectInfo.aliasPrefix}/components`,
        },
        {
          type: "text",
          name: "ui",
          message: "Configure the import alias for UI components:",
          initial: `${projectInfo.aliasPrefix}/components/ui`,
        },
        {
          type: "text",
          name: "utils",
          message: "Configure the import alias for utils:",
          initial: `${projectInfo.aliasPrefix}/lib/utils`,
        },
        {
          type: "text",
          name: "registry",
          message: "Which registry would you like to use?",
          initial: DEFAULT_REGISTRY_URL,
        },
      ]);

      config = {
        $schema: "https://ensolid.dev/schema.json",
        style: "default",
        rsc: false,
        tsx: response.typescript,
        tailwind: {
          config: response.tailwindConfig,
          css: response.tailwindCss,
          baseColor: response.baseColor,
          cssVariables: response.cssVariables,
        },
        registry: response.registry,
        aliases: {
          components: response.components,
          utils: response.utils,
          ui: response.ui,
          lib: `${projectInfo.aliasPrefix}/lib`,
          hooks: `${projectInfo.aliasPrefix}/hooks`,
        },
      };
    }

    try {
      // Validate config
      configSchema.parse(config);
    } catch (error) {
      console.error(chalk.red("Invalid configuration:"), error);
      process.exit(1);
    }

    // Verify registry is accessible
    spinner.start("Verifying registry...");
    const registryOk = await isRegistryAccessible(config.registry);
    if (!registryOk) {
      spinner.warn("Could not verify registry accessibility. Continuing anyway...");
    } else {
      spinner.succeed("Registry verified");
    }

    // Create directories
    spinner.start("Creating directories...");
    const uiDir = resolveAliasToPath(config.aliases.ui || config.aliases.components, cwd, projectInfo.aliasPrefix);
    const libDir = resolveAliasToPath(config.aliases.lib || `${projectInfo.aliasPrefix}/lib`, cwd, projectInfo.aliasPrefix);
    
    await fs.ensureDir(uiDir);
    await fs.ensureDir(libDir);
    spinner.succeed("Directories created");

    // Create utils file
    spinner.start("Creating utils file...");
    const utilsPath = resolveAliasToPath(config.aliases.utils, cwd, projectInfo.aliasPrefix);
    const utilsDir = path.dirname(utilsPath);
    
    await fs.ensureDir(utilsDir);
    
    if (!fs.existsSync(utilsPath) || options.force) {
      const utilsContent = config.tsx ? UTILS_TEMPLATE : UTILS_TEMPLATE_JS;
      const utilsFileExt = config.tsx ? ".ts" : ".js";
      const finalUtilsPath = utilsPath.endsWith(".ts") || utilsPath.endsWith(".js") 
        ? utilsPath 
        : `${utilsPath}${utilsFileExt}`;
      await fs.writeFile(finalUtilsPath, utilsContent);
      spinner.succeed(`Created ${path.relative(cwd, finalUtilsPath)}`);
    } else {
      spinner.succeed("Utils file already exists");
    }

    // Update CSS with variables if needed
    if (config.tailwind.cssVariables) {
      spinner.start("Setting up CSS variables...");
      const cssPath = path.resolve(cwd, config.tailwind.css);
      
      if (!fs.existsSync(cssPath)) {
        await fs.ensureDir(path.dirname(cssPath));
        await fs.writeFile(cssPath, CSS_VARIABLES);
        spinner.succeed(`Created ${config.tailwind.css}`);
      } else {
        // Check if CSS variables are already present
        const cssContent = await fs.readFile(cssPath, "utf-8");
        if (!cssContent.includes("--background:")) {
          // Prepend CSS variables
          await fs.writeFile(cssPath, CSS_VARIABLES + "\n" + cssContent);
          spinner.succeed("Added CSS variables to existing CSS file");
        } else {
          spinner.succeed("CSS variables already configured");
        }
      }
    }

    // Install dependencies
    spinner.start("Installing dependencies...");
    const packageManager = await getPackageManager(cwd);
    const installCmd = getInstallCommand(packageManager);
    
    const deps = ["clsx", "tailwind-merge"];
    
    try {
      await execa(packageManager, [installCmd, ...deps], { cwd });
      spinner.succeed("Dependencies installed");
    } catch (error) {
      spinner.fail("Failed to install dependencies. You can install them manually:");
      console.log(chalk.dim(`  ${packageManager} ${installCmd} ${deps.join(" ")}`));
    }

    // Write config
    spinner.start("Writing configuration...");
    await fs.writeJSON(configPath, config, { spaces: 2 });
    spinner.succeed("Configuration saved to ensolid.json");

    console.log(chalk.green("\n✓ Success! Project initialized.\n"));
    console.log("You can now add components to your project:");
    console.log(chalk.cyan("  npx @ensolid/cli add button"));
    console.log(chalk.cyan("  npx @ensolid/cli add --all\n"));
  });

/**
 * Resolve an alias path to an actual file system path
 */
function resolveAliasToPath(aliasPath: string, cwd: string, prefix: string): string {
  // Handle common alias patterns
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

  // If no alias pattern matched, treat as relative path
  return path.resolve(cwd, aliasPath);
}
