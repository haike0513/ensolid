import path from "path";
import fs from "fs-extra";

export type PackageManager = "pnpm" | "npm" | "yarn" | "bun";

/**
 * Detect the package manager used in the project
 */
export async function getPackageManager(cwd: string): Promise<PackageManager> {
  // Check for lockfiles in order of preference
  if (fs.existsSync(path.resolve(cwd, "pnpm-lock.yaml"))) return "pnpm";
  if (fs.existsSync(path.resolve(cwd, "bun.lockb"))) return "bun";
  if (fs.existsSync(path.resolve(cwd, "yarn.lock"))) return "yarn";
  if (fs.existsSync(path.resolve(cwd, "package-lock.json"))) return "npm";

  // Check for packageManager field in package.json
  const packageJsonPath = path.resolve(cwd, "package.json");
  if (fs.existsSync(packageJsonPath)) {
    try {
      const packageJson = await fs.readJSON(packageJsonPath);
      if (packageJson.packageManager) {
        const pm = packageJson.packageManager.split("@")[0];
        if (["pnpm", "npm", "yarn", "bun"].includes(pm)) {
          return pm as PackageManager;
        }
      }
    } catch {
      // Ignore errors
    }
  }

  return "npm";
}

/**
 * Get the install command for a package manager
 */
export function getInstallCommand(pm: PackageManager): string {
  switch (pm) {
    case "yarn":
      return "add";
    case "bun":
      return "add";
    default:
      return "install";
  }
}

/**
 * Get the dev install flag for a package manager
 */
export function getDevFlag(pm: PackageManager): string {
  switch (pm) {
    case "yarn":
      return "--dev";
    case "npm":
      return "--save-dev";
    case "pnpm":
      return "-D";
    case "bun":
      return "--dev";
    default:
      return "--save-dev";
  }
}

/**
 * Get the command to run a package
 */
export function getRunCommand(pm: PackageManager): string {
  switch (pm) {
    case "yarn":
      return "yarn";
    case "bun":
      return "bunx";
    case "pnpm":
      return "pnpm dlx";
    default:
      return "npx";
  }
}
