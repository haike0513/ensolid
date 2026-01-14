import path from "path";
import fs from "fs-extra";
import { configSchema, type Config } from "../types";

const CONFIG_FILE_NAME = "ensolid.json";
const LEGACY_CONFIG_FILE_NAMES = ["components.json"]; // In case we need to support migration

/**
 * Get the configuration from the project
 */
export async function getConfig(cwd: string): Promise<Config | null> {
  const configPath = path.resolve(cwd, CONFIG_FILE_NAME);

  // Check for main config file
  if (fs.existsSync(configPath)) {
    try {
      const config = await fs.readJSON(configPath);
      return configSchema.parse(config);
    } catch (error) {
      if (error instanceof Error) {
        console.warn(`Warning: Invalid config file: ${error.message}`);
      }
      return null;
    }
  }

  // Check for legacy config files
  for (const legacyName of LEGACY_CONFIG_FILE_NAMES) {
    const legacyPath = path.resolve(cwd, legacyName);
    if (fs.existsSync(legacyPath)) {
      console.warn(`Warning: Found legacy config file "${legacyName}". Consider migrating to "${CONFIG_FILE_NAME}".`);
      try {
        const config = await fs.readJSON(legacyPath);
        return configSchema.parse(config);
      } catch {
        return null;
      }
    }
  }

  return null;
}

/**
 * Check if a project has been initialized
 */
export async function isProjectInitialized(cwd: string): Promise<boolean> {
  const config = await getConfig(cwd);
  return config !== null;
}

/**
 * Get the path to the config file
 */
export function getConfigPath(cwd: string): string {
  return path.resolve(cwd, CONFIG_FILE_NAME);
}

/**
 * Write the config to the project
 */
export async function writeConfig(cwd: string, config: Config): Promise<void> {
  const configPath = getConfigPath(cwd);
  await fs.writeJSON(configPath, config, { spaces: 2 });
}

/**
 * Update specific fields in the config
 */
export async function updateConfig(
  cwd: string,
  updates: Partial<Config>
): Promise<Config | null> {
  const config = await getConfig(cwd);
  if (!config) return null;

  const updatedConfig = { ...config, ...updates };
  await writeConfig(cwd, updatedConfig);
  return updatedConfig;
}
