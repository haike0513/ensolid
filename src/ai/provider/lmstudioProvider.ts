import { createOpenAICompatible } from "@ai-sdk/openai-compatible";

export const lmstudioProvider = createOpenAICompatible({
    name: "lmstudio",
    baseURL: "http://localhost:1234/v1",
});
