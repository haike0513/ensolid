#!/usr/bin/env node
import { Command } from "commander";
import chalk from "chalk";
import { init } from "./commands/init";
import { add } from "./commands/add";
import { diff } from "./commands/diff";
import { list } from "./commands/list";

const LOGO = `
  ╔═══════════════════════════════════════╗
  ║                                       ║
  ║     ███████╗███╗   ██╗███████╗        ║
  ║     ██╔════╝████╗  ██║██╔════╝        ║
  ║     █████╗  ██╔██╗ ██║███████╗        ║
  ║     ██╔══╝  ██║╚██╗██║╚════██║        ║
  ║     ███████╗██║ ╚████║███████║        ║
  ║     ╚══════╝╚═╝  ╚═══╝╚══════╝        ║
  ║                                       ║
  ║        E N S O L I D   C L I          ║
  ╚═══════════════════════════════════════╝
`;

async function main() {
  const program = new Command()
    .name("ensolid")
    .description("Add beautiful, accessible SolidJS components to your project")
    .version("0.0.1", "-v, --version", "display the version number")
    .configureHelp({
      sortSubcommands: true,
      subcommandTerm: (cmd) => cmd.name(),
    });

  // Add global options
  program.showHelpAfterError("(add --help for additional information)");
  program.showSuggestionAfterError(true);

  // Add commands
  program.addCommand(init);
  program.addCommand(add);
  program.addCommand(diff);
  program.addCommand(list);

  // Custom help display
  program.addHelpText("beforeAll", chalk.cyan(LOGO));
  program.addHelpText(
    "after",
    `
${chalk.bold("Examples:")}
  ${chalk.dim("$")} npx @ensolid/cli init
  ${chalk.dim("$")} npx @ensolid/cli add button
  ${chalk.dim("$")} npx @ensolid/cli add button dialog card
  ${chalk.dim("$")} npx @ensolid/cli add --all
  ${chalk.dim("$")} npx @ensolid/cli list
  ${chalk.dim("$")} npx @ensolid/cli diff

${chalk.bold("Documentation:")}
  ${chalk.blue("https://ensolid.dev/docs")}
`
  );

  // Handle unknown commands gracefully
  program.on("command:*", (operands) => {
    console.error(chalk.red(`Unknown command: ${operands[0]}`));
    const availableCommands = program.commands.map((c) => c.name());
    console.log(`Available commands: ${availableCommands.join(", ")}`);
    process.exit(1);
  });

  try {
    await program.parseAsync(process.argv);
  } catch (error) {
    if (error instanceof Error) {
      console.error(chalk.red("Error:"), error.message);
    }
    process.exit(1);
  }
}

main();
