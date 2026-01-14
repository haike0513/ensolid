import { z } from "zod";

export const registryItemSchema = z.object({
  name: z.string(),
  type: z.enum(["components:ui", "components:component", "components:example"]),
  dependencies: z.array(z.string()).optional(),
  registryDependencies: z.array(z.string()).optional(),
  files: z.array(z.string()),
});

export const registryIndexSchema = z.array(registryItemSchema);

export const configSchema = z.object({
  $schema: z.string().optional(),
  style: z.string(),
  rsc: z.boolean(),
  tsx: z.boolean(),
  tailwind: z.object({
    config: z.string(),
    css: z.string(),
    baseColor: z.string(),
    cssVariables: z.boolean(),
  }),
  registry: z.string(),
  aliases: z.object({
    components: z.string(),
    utils: z.string(),
    ui: z.string().optional(),
  }),
});

export type Config = z.infer<typeof configSchema>;
export type RegistryItem = z.infer<typeof registryItemSchema>;
export type RegistryIndex = z.infer<typeof registryIndexSchema>;
