import { Command } from "commander";
import path from "path";
import fs from "fs-extra";
import chalk from "chalk";
import ora from "ora";
import { getConfig } from "../utils/get-config";
import { getRegistryItemWithContent, getRawUrlBase, getRegistryIndex } from "../utils/registry";
import type { Config } from "../types";

export const diff = new Command()
  .name("diff")
  .description("Check for updates against the registry")
  .argument("[component]", "the component to check (or leave empty for all)")
  .option("-c, --cwd <cwd>", "the working directory. defaults to current directory.", process.cwd())
  .action(async (component: string | undefined, options) => {
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

      const spinner = ora("Checking for updates...").start();

      // Get local components directory
      const uiDir = resolveAliasToPath(config.aliases.ui || config.aliases.components, cwd);
      
      if (!fs.existsSync(uiDir)) {
        spinner.fail("No components directory found");
        console.log(chalk.dim(`Expected: ${uiDir}`));
        process.exit(1);
      }

      // Get list of installed components
      const installedFiles = await fs.readdir(uiDir);
      const installedComponents = installedFiles
        .filter((file) => file.endsWith(".tsx") || file.endsWith(".jsx"))
        .map((file) => file.replace(/\.(tsx|jsx)$/, ""));

      if (installedComponents.length === 0) {
        spinner.succeed("No components installed");
        process.exit(0);
      }

      // If specific component provided, filter
      const componentsToCheck = component 
        ? installedComponents.filter((c) => c === component)
        : installedComponents;

      if (componentsToCheck.length === 0) {
        spinner.fail(`Component "${component}" is not installed`);
        process.exit(1);
      }

      spinner.text = `Checking ${componentsToCheck.length} component(s)...`;

      const results: DiffResult[] = [];

      for (const compName of componentsToCheck) {
        try {
          const result = await checkComponentDiff(compName, config, cwd, uiDir);
          results.push(result);
        } catch (error) {
          results.push({
            name: compName,
            status: "error",
            message: (error as Error).message,
          });
        }
      }

      spinner.succeed("Diff check complete");
      console.log("");

      // Display results
      const updated = results.filter((r) => r.status === "updated");
      const unchanged = results.filter((r) => r.status === "unchanged");
      const errors = results.filter((r) => r.status === "error");
      const notFound = results.filter((r) => r.status === "not-found");

      if (updated.length > 0) {
        console.log(chalk.yellow(`⚠ ${updated.length} component(s) have updates available:`));
        updated.forEach((r) => {
          console.log(chalk.yellow(`  - ${r.name}`));
          if (r.changes) {
            console.log(chalk.dim(`    ${r.changes.added} additions, ${r.changes.removed} deletions`));
          }
        });
        console.log("");
        console.log(chalk.dim("To update a component, run:"));
        console.log(chalk.cyan(`  npx @ensolid/cli add <component> --overwrite`));
        console.log("");
      }

      if (unchanged.length > 0) {
        console.log(chalk.green(`✓ ${unchanged.length} component(s) are up to date`));
      }

      if (notFound.length > 0) {
        console.log(chalk.dim(`○ ${notFound.length} component(s) not found in registry (custom components?)`));
        notFound.forEach((r) => console.log(chalk.dim(`  - ${r.name}`)));
      }

      if (errors.length > 0) {
        console.log(chalk.red(`✗ ${errors.length} error(s) occurred:`));
        errors.forEach((r) => console.log(chalk.red(`  - ${r.name}: ${r.message}`)));
      }

    } catch (error) {
      console.error(chalk.red("An error occurred:"), (error as Error).message);
      process.exit(1);
    }
  });

interface DiffResult {
  name: string;
  status: "updated" | "unchanged" | "error" | "not-found";
  message?: string;
  changes?: {
    added: number;
    removed: number;
  };
}

async function checkComponentDiff(
  componentName: string,
  config: Config,
  cwd: string,
  uiDir: string
): Promise<DiffResult> {
  // Get local file content
  const localPath = path.resolve(uiDir, `${componentName}.tsx`);
  const localPathJsx = path.resolve(uiDir, `${componentName}.jsx`);
  
  const actualPath = fs.existsSync(localPath) ? localPath : localPathJsx;
  
  if (!fs.existsSync(actualPath)) {
    return { name: componentName, status: "not-found" };
  }

  const localContent = await fs.readFile(actualPath, "utf-8");

  // Get remote file content
  try {
    const remoteItem = await getRegistryItemWithContent(config.registry, componentName);
    
    // Find the matching file
    let remoteContent: string | undefined;
    for (const [filePath, content] of remoteItem.content) {
      if (filePath.endsWith(`${componentName}.tsx`) || filePath.endsWith(`${componentName}.jsx`)) {
        remoteContent = content;
        break;
      }
    }

    if (!remoteContent) {
      return { name: componentName, status: "not-found" };
    }

    // Normalize content for comparison (remove extra whitespace, normalize line endings)
    const normalizedLocal = normalizeContent(localContent);
    const normalizedRemote = normalizeContent(remoteContent);

    if (normalizedLocal === normalizedRemote) {
      return { name: componentName, status: "unchanged" };
    }

    // Calculate diff stats
    const changes = calculateDiffStats(localContent, remoteContent);

    return {
      name: componentName,
      status: "updated",
      changes,
    };
  } catch (error) {
    // Component not found in registry
    return { name: componentName, status: "not-found" };
  }
}

function normalizeContent(content: string): string {
  return content
    .replace(/\r\n/g, "\n") // Normalize line endings
    .replace(/\s+$/gm, "") // Remove trailing whitespace
    .trim();
}

function calculateDiffStats(local: string, remote: string): { added: number; removed: number } {
  const localLines = new Set(local.split("\n").map((l) => l.trim()));
  const remoteLines = new Set(remote.split("\n").map((l) => l.trim()));

  let added = 0;
  let removed = 0;

  for (const line of remoteLines) {
    if (!localLines.has(line)) added++;
  }

  for (const line of localLines) {
    if (!remoteLines.has(line)) removed++;
  }

  return { added, removed };
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
