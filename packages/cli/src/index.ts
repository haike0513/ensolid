#!/usr/bin/env node
import { Command } from "commander";
import { init } from "./commands/init";
import { add } from "./commands/add";

function main() {
  const program = new Command()
    .name("ensolid")
    .description("Add components to your project")
    .version("0.0.1");

  program.addCommand(init);
  program.addCommand(add);

  program.parse();
}

main();
