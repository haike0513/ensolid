import type { ChatTransport, UIMessage, UIMessageChunk } from "ai";
import { streamText } from "ai";
import { getGateway } from "./gateway";
import { normalizeModelId } from "./utils";
import { lmstudioProvider } from "./provider/lmstudioProvider";
import { registry } from "./registry";

/**
 * 自定义 ChatTransport，使用 Gateway 来获取模型
 * 支持 providerId:modelId 格式，例如: 'gateway:gpt-4'
 * 如果只提供 modelId，默认使用 'gateway' 作为 provider
 *
 * 无需通过 HTTP API，直接在前端调用 streamText
 */
export class GatewayChatTransport<UI_MESSAGE extends UIMessage>
  implements ChatTransport<UI_MESSAGE> {
  private modelId: string;

  /**
   * @param modelId - 模型 ID，支持格式:
   *   - 'gateway:gpt-4' (完整格式: providerId:modelId)
   *   - 'gpt-4' (简化格式，默认使用 gateway provider)
   */
  constructor(modelId: string = "gateway:gpt-4") {
    this.modelId = modelId;
  }

  async sendMessages(options: {
    trigger: "submit-message" | "regenerate-message";
    chatId: string;
    messageId: string | undefined;
    messages: UI_MESSAGE[];
    abortSignal: AbortSignal | undefined;
  }): Promise<ReadableStream<UIMessageChunk>> {
    // 将 UIMessage 转换为 streamText 需要的格式
    const modelMessages = options.messages.map((msg) => {
      const textContent = (msg.parts ?? [])
        .filter((part) => part && part.type === "text")
        .map((part) =>
          part && part.type === "text" && typeof part.text === "string"
            ? part.text
            : ""
        )
        .join("") || "";

      return {
        role: msg.role as "user" | "assistant" | "system",
        content: textContent,
      };
    });

    // 使用 gateway 获取模型
    // 规范化模型 ID，确保使用 providerId:modelId 格式
    const fullModelId = normalizeModelId(this.modelId, "gateway");
    const gateway = getGateway();

    // 从 gateway 获取模型
    // gateway 的 languageModel 方法接受完整的模型 ID（包含 provider 前缀）
    // 例如: "gateway:gpt-4" 或直接使用模型 ID "gpt-4"
    // const model = gateway.languageModel(fullModelId);
    const model = registry.languageModel("lmstudio:qwen/qwen3-vl-8b");

    console.log("model", model);
    // 使用 streamText 调用模型
    const result = await streamText({
      // model: lmstudioProvider.languageModel("qwen/qwen3-vl-8b"),
      model,
      messages: modelMessages,
      maxRetries: 1,
      abortSignal: options.abortSignal,
    });

    // 将 streamText 的结果转换为 UIMessageChunk 流
    const uiMessageStreamResponse = await result.toUIMessageStreamResponse();

    if (!uiMessageStreamResponse.body) {
      throw new Error("Response body is null");
    }

    // 解析 SSE 格式的流并转换为 UIMessageChunk
    const reader = uiMessageStreamResponse.body.getReader();
    const decoder = new TextDecoder();
    let buffer = "";

    return new ReadableStream<UIMessageChunk>({
      async pull(controller) {
        try {
          while (true) {
            const { done, value } = await reader.read();

            if (done) {
              // 处理剩余的 buffer
              if (buffer.trim()) {
                const lines = buffer.split("\n\n");
                for (const line of lines) {
                  if (line && line.trim() && line.startsWith("data: ")) {
                    const data = line.slice(6).trim();
                    if (data && data !== "[DONE]") {
                      try {
                        const chunk = JSON.parse(data) as UIMessageChunk;
                        controller.enqueue(chunk);
                      } catch (e) {
                        // 忽略解析错误
                      }
                    }
                  }
                }
              }
              controller.close();
              break;
            }

            buffer += decoder.decode(value, { stream: true });
            const lines = buffer.split("\n\n");
            buffer = lines.pop() || "";

            for (const line of lines) {
              if (line && line.trim()) {
                // 处理 SSE 格式: data: {...}
                if (line.startsWith("data: ")) {
                  const data = line.slice(6).trim();
                  if (data && data !== "[DONE]") {
                    try {
                      const chunk = JSON.parse(data) as UIMessageChunk;
                      controller.enqueue(chunk);
                    } catch (e) {
                      // 忽略解析错误，继续处理下一行
                    }
                  }
                }
              }
            }
          }
        } catch (error) {
          controller.error(error);
        }
      },
      cancel() {
        reader.cancel();
      },
    });
  }

  async reconnectToStream(_options: {
    chatId: string;
  }): Promise<ReadableStream<UIMessageChunk> | null> {
    // Gateway 不支持重新连接流，返回 null
    return null;
  }
}
