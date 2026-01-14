import fetch from "node-fetch";
import { registryIndexSchema, type RegistryIndex, type RegistryItem, registryItemSchema } from "../types";

export interface RegistryItemWithContent extends RegistryItem {
  content: Map<string, string>;
}

/**
 * Get the registry index (list of all available components)
 */
export async function getRegistryIndex(baseUrl: string): Promise<RegistryIndex> {
  try {
    const rawBaseUrl = getRawUrlBase(baseUrl);
    const response = await fetch(`${rawBaseUrl}/index.json`);
    
    if (!response.ok) {
      throw new Error(`Failed to fetch registry index from ${rawBaseUrl}/index.json (${response.status})`);
    }

    const data = await response.json();
    return registryIndexSchema.parse(data);
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Failed to fetch registry index: ${error.message}`);
    }
    throw new Error(`Failed to fetch registry index.`);
  }
}

/**
 * Get a single registry item metadata
 */
export async function getRegistryItem(baseUrl: string, name: string): Promise<RegistryItem> {
  try {
    const rawBaseUrl = getRawUrlBase(baseUrl);
    const response = await fetch(`${rawBaseUrl}/components/${name}.json`);
    
    if (!response.ok) {
      throw new Error(`Component "${name}" not found in registry (${response.status})`);
    }

    const data = await response.json();
    return registryItemSchema.parse(data);
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Failed to fetch component "${name}": ${error.message}`);
    }
    throw new Error(`Failed to fetch registry item ${name}.`);
  }
}

/**
 * Get a registry item with its file contents
 */
export async function getRegistryItemWithContent(
  baseUrl: string, 
  name: string
): Promise<RegistryItemWithContent> {
  const item = await getRegistryItem(baseUrl, name);
  const rawBaseUrl = getRawUrlBase(baseUrl);
  const content = new Map<string, string>();

  for (const file of item.files) {
    const fileUrl = `${rawBaseUrl}/${file}`;
    const response = await fetch(fileUrl);
    
    if (!response.ok) {
      throw new Error(`Failed to fetch file ${file} for component "${name}"`);
    }

    const fileContent = await response.text();
    content.set(file, fileContent);
  }

  return { ...item, content };
}

/**
 * Resolve all dependencies for a set of components
 */
export async function resolveRegistryDependencies(
  baseUrl: string,
  componentNames: string[]
): Promise<RegistryItem[]> {
  const resolved = new Map<string, RegistryItem>();
  const queue = [...componentNames];

  while (queue.length > 0) {
    const name = queue.shift()!;
    
    if (resolved.has(name)) {
      continue;
    }

    try {
      const item = await getRegistryItem(baseUrl, name);
      resolved.set(name, item);

      if (item.registryDependencies) {
        for (const dep of item.registryDependencies) {
          if (!resolved.has(dep)) {
            queue.push(dep);
          }
        }
      }
    } catch (error) {
      // Skip missing dependencies but warn
      console.warn(`Warning: Could not resolve dependency "${name}"`);
    }
  }

  return Array.from(resolved.values());
}

/**
 * Get the raw content URL base from a GitHub URL
 */
export function getRawUrlBase(githubUrl: string): string {
  // If it's already a raw.githubusercontent.com URL, return as is
  if (githubUrl.includes("raw.githubusercontent.com")) {
    return githubUrl.replace(/\/$/, ""); // Remove trailing slash
  }

  // Convert GitHub tree URLs to raw URLs
  // e.g., https://github.com/user/repo/tree/main/path -> https://raw.githubusercontent.com/user/repo/main/path
  if (githubUrl.includes("github.com")) {
    return githubUrl
      .replace("github.com", "raw.githubusercontent.com")
      .replace("/tree/", "/")
      .replace(/\/$/, "");
  }

  // Return as-is for other URLs (e.g., local servers)
  return githubUrl.replace(/\/$/, "");
}

/**
 * Check if a registry is accessible
 */
export async function isRegistryAccessible(baseUrl: string): Promise<boolean> {
  try {
    const rawBaseUrl = getRawUrlBase(baseUrl);
    const response = await fetch(`${rawBaseUrl}/index.json`, {
      method: "HEAD",
    });
    return response.ok;
  } catch {
    return false;
  }
}

/**
 * Search for components in the registry
 */
export async function searchRegistry(
  baseUrl: string,
  query: string
): Promise<RegistryIndex> {
  const index = await getRegistryIndex(baseUrl);
  const lowerQuery = query.toLowerCase();
  
  return index.filter((item) => 
    item.name.toLowerCase().includes(lowerQuery) ||
    item.description?.toLowerCase().includes(lowerQuery)
  );
}
