import fetch from "node-fetch";
import { registryIndexSchema, type RegistryIndex, type RegistryItem } from "../types";

export async function getRegistryIndex(baseUrl: string): Promise<RegistryIndex> {
  try {
    const rawBaseUrl = getRawUrlBase(baseUrl);
    const response = await fetch(`${rawBaseUrl}/index.json`);
    
    if (!response.ok) {
      throw new Error(`Failed to fetch registry index from ${rawBaseUrl}/index.json`);
    }

    const data = await response.json();
    return registryIndexSchema.parse(data);
  } catch (error) {
    console.error(error);
    throw new Error(`Failed to fetch registry index.`);
  }
}

export async function getRegistryItem(baseUrl: string, name: string): Promise<RegistryItem> {
  try {
    const rawBaseUrl = getRawUrlBase(baseUrl);
    const response = await fetch(`${rawBaseUrl}/components/${name}.json`);
    
    if (!response.ok) {
      throw new Error(`Failed to fetch component ${name} from ${rawBaseUrl}/components/${name}.json`);
    }

    const data = await response.json();
    // Assuming the item structure is the same as RegistryItem
    return data as RegistryItem;
  } catch (error) {
    throw new Error(`Failed to fetch registry item ${name}.`);
  }
}

export function getRawUrlBase(githubUrl: string) {
  if (githubUrl.includes("github.com")) {
    return githubUrl
      .replace("github.com", "raw.githubusercontent.com")
      .replace("/tree/", "/");
  }
  return githubUrl;
}
