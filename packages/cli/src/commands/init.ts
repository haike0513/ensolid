import { Command } from "commander";
import prompts from "prompts";
import path from "path";
import fs from "fs-extra";
import chalk from "chalk";
import { configSchema } from "../types";

export const init = new Command()
  .name("init")
  .description("Initialize your project and install dependencies")
  .option("-y, --yes", "skip confirmation prompt.", false)
  .option("-c, --cwd <cwd>", "the working directory. defaults to current directory.", process.cwd())
  .action(async (options: any) => {
    const cwd = path.resolve(options.cwd);

    if (!fs.existsSync(cwd)) {
      console.error(`The path ${cwd} does not exist.`);
      process.exit(1);
    }

    const configPath = path.resolve(cwd, "ensolid.json");

    if (fs.existsSync(configPath) && !options.yes) {
      const response = await prompts({
        type: "confirm",
        name: "overwrite",
        message: "ensolid.json already exists. Overwrite?",
        initial: false,
      });

      if (!response.overwrite) {
        process.exit(0);
      }
    }

    const response = await prompts([
      {
        type: "text",
        name: "components",
        message: "Where is your components directory?",
        initial: "src/components",
      },
      {
        type: "text",
        name: "ui",
        message: "Where is your UI components directory?",
        initial: "src/components/ui",
      },
      {
        type: "text",
        name: "utils",
        message: "Where is your utils file?",
        initial: "src/lib/utils.ts",
      },
      {
        type: "text",
        name: "registry",
        message: "Which registry would you like to use?",
        initial: "https://github.com/haike0513/ensolid/tree/main/src/components/ui",
      },
    ]);

    const config = {
      $schema: "https://ensolid.com/schema.json",
      style: "default",
      rsc: false,
      tsx: true,
      tailwind: {
        config: "tailwind.config.js",
        css: "src/index.css",
        baseColor: "slate",
        cssVariables: true,
      },
      registry: response.registry,
      aliases: {
        components: response.components,
        utils: response.utils,
        ui: response.ui,
      },
    };

    try {
      // Validate config
      configSchema.parse(config);

      await fs.writeJSON(configPath, config, { spaces: 2 });

      console.log(chalk.green("\nSuccess! Project initialized."));
      console.log("Configuration saved to ensolid.json");
    } catch (error) {
      console.error(chalk.red("Failed to initialize project:"), error);
      process.exit(1);
    }
  });
