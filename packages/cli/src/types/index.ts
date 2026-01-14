import { z } from "zod";

// Registry item schema for individual component metadata
export const registryItemSchema = z.object({
  name: z.string(),
  type: z.enum(["components:ui", "components:component", "components:example"]),
  dependencies: z.array(z.string()).optional(),
  devDependencies: z.array(z.string()).optional(),
  registryDependencies: z.array(z.string()).optional(),
  files: z.array(z.string()),
  description: z.string().optional(),
});

// Registry index schema
export const registryIndexSchema = z.array(
  z.object({
    name: z.string(),
    type: z.enum(["components:ui", "components:component", "components:example"]).optional(),
    dependencies: z.array(z.string()).optional(),
    devDependencies: z.array(z.string()).optional(),
    registryDependencies: z.array(z.string()).optional(),
    files: z.array(z.string()),
    description: z.string().optional(),
  })
);

// Tailwind configuration schema
export const tailwindConfigSchema = z.object({
  config: z.string(),
  css: z.string(),
  baseColor: z.string(),
  cssVariables: z.boolean().default(true),
  prefix: z.string().optional(),
});

// Aliases configuration schema
export const aliasesSchema = z.object({
  components: z.string(),
  utils: z.string(),
  ui: z.string().optional(),
  lib: z.string().optional(),
  hooks: z.string().optional(),
});

// Main config schema for ensolid.json
export const configSchema = z.object({
  $schema: z.string().optional(),
  style: z.string().default("default"),
  rsc: z.boolean().default(false),
  tsx: z.boolean().default(true),
  tailwind: tailwindConfigSchema,
  registry: z.string(),
  aliases: aliasesSchema,
  iconLibrary: z.string().optional(),
});

// Framework detection result
export const frameworkSchema = z.object({
  name: z.enum(["solid-start", "vite-solid", "unknown"]),
  isSrcDir: z.boolean(),
  isUsingTypeScript: z.boolean(),
});

// Export types
export type Config = z.infer<typeof configSchema>;
export type TailwindConfig = z.infer<typeof tailwindConfigSchema>;
export type Aliases = z.infer<typeof aliasesSchema>;
export type RegistryItem = z.infer<typeof registryItemSchema>;
export type RegistryIndex = z.infer<typeof registryIndexSchema>;
export type Framework = z.infer<typeof frameworkSchema>;

// Default registry URL
export const DEFAULT_REGISTRY_URL = "https://raw.githubusercontent.com/haike0513/ensolid/main/public/registry";

// Default config values
export const DEFAULT_CONFIG: Partial<Config> = {
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
    components: "@/components",
    utils: "@/lib/utils",
    ui: "@/components/ui",
    lib: "@/lib",
    hooks: "@/hooks",
  },
};
