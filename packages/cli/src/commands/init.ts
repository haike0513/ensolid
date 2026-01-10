import { Command } from "commander";
import prompts from "prompts";
import path from "path";
import fs from "fs-extra";
import chalk from "chalk";

export const init = new Command()
  .name("init")
  .description("Initialize your project and install dependencies")
  .action(async () => {
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
      aliases: {
        components: response.components,
        utils: response.utils,
        ui: response.ui,
      },
    };

    const targetPath = path.resolve(process.cwd(), "ensolid.json");
    await fs.writeJSON(targetPath, config, { spaces: 2 });

    console.log(chalk.green("\nSuccess! Project initialized."));
    console.log("Configuration saved to ensolid.json");
  });
