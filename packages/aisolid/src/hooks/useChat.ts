/**
 * useChat hook - 用于聊天对话
 * 移植自 Vercel AI SDK React 包
 */

import { createSignal, createEffect, onCleanup, batch } from 'solid-js';
import type { UseChatOptions, UseChatHelpers, Message } from '../types';
import type { UIMessage, UIMessageChunk } from 'ai';
import { generateId } from '../utils';

export function useChat(options: UseChatOptions = {}): UseChatHelpers {
  const {
    api = '/api/chat',
    transport,
    id,
    initialMessages = [],
    initialInput = '',
    onResponse,
    onFinish,
    onError,
    headers,
    body,
    credentials,
    generateId: customGenerateId = generateId,
    keepLastMessageOnError = false,
    fetch: customFetch = fetch,
  } = options;

  // 如果提供了 transport，优先使用 transport
  const useTransport = !!transport;

  const [messages, setMessages] = createSignal<Message[]>(initialMessages);
  const [input, setInput] = createSignal(initialInput);
  const [isLoading, setIsLoading] = createSignal(false);
  const [error, setError] = createSignal<Error | undefined>(undefined);
  const [abortController, setAbortController] = createSignal<AbortController | null>(null);

  // 从 localStorage 恢复消息（如果提供了 id）
  createEffect(() => {
    if (id && typeof window !== 'undefined') {
      try {
        const stored = localStorage.getItem(`ai-chat-${id}`);
        if (stored) {
          const parsed = JSON.parse(stored);
          if (Array.isArray(parsed)) {
            setMessages(parsed.map((msg) => ({
              ...msg,
              createdAt: msg.createdAt ? new Date(msg.createdAt) : new Date(),
            })));
          }
        }
      } catch (e) {
        // Ignore parse errors
      }
    }
  });

  // 保存消息到 localStorage
  createEffect(() => {
    if (id && typeof window !== 'undefined') {
      try {
        localStorage.setItem(`ai-chat-${id}`, JSON.stringify(messages()));
      } catch (e) {
        // Ignore storage errors
      }
    }
  });

  const append = async (
    message: Message | Pick<Message, 'role' | 'content'>,
    options?: { data?: any; experimental_attachments?: any }
  ): Promise<string | null> => {
    const messageId = customGenerateId();
    const userMessage: Message = {
      id: messageId,
      role: message.role,
      content: message.content,
      createdAt: new Date(),
      ...('id' in message ? message : {}),
    };

    batch(() => {
      setMessages((prev) => [...prev, userMessage]);
      setIsLoading(true);
      setError(undefined);
    });

    const abortController = new AbortController();
    setAbortController(abortController);

    try {
      // 如果使用 transport
      if (useTransport && transport) {
        // 将 Message 转换为 UIMessage
        const uiMessages: UIMessage[] = messages()
          .filter((msg) => msg.role === 'user' || msg.role === 'assistant' || msg.role === 'system')
          .map((msg) => ({
            id: msg.id,
            role: msg.role as 'user' | 'assistant' | 'system',
            parts: [{ type: 'text', text: msg.content }],
          }));

        // 使用 transport 发送消息
        const stream = await transport.sendMessages({
          trigger: 'submit-message',
          chatId: id || 'default',
          messageId: undefined,
          messages: uiMessages,
          abortSignal: abortController.signal,
        });

        let assistantMessageId = customGenerateId();
        let assistantMessage: Message = {
          id: assistantMessageId,
          role: 'assistant',
          content: '',
          createdAt: new Date(),
        };

        batch(() => {
          setMessages((prev) => [...prev, assistantMessage]);
        });

        const reader = stream.getReader();
        let fullContent = '';

        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          const chunk = value as UIMessageChunk;

          // 处理不同类型的 chunk
          if (chunk.type === 'text-delta') {
            // text-delta chunk 有 delta 属性
            fullContent += (chunk as any).delta || '';
          } else {
            // 处理其他可能的 chunk 类型
            const chunkAny = chunk as any;
            if (chunkAny.message && chunkAny.message.parts) {
              // 如果包含 message 对象
              const msg = chunkAny.message;
              fullContent = msg.parts
                .filter((part: any) => part && part.type === 'text')
                .map((part: any) => (part && part.type === 'text' && typeof part.text === 'string' ? part.text : ''))
                .join('');
            } else if (chunkAny.delta) {
              // 如果有 delta 属性
              fullContent += chunkAny.delta;
            }
          }

          // 更新助手消息
          batch(() => {
            setMessages((prev) => {
              const updated = [...prev];
              const index = updated.findIndex((m) => m.id === assistantMessageId);
              if (index !== -1) {
                updated[index] = {
                  ...updated[index],
                  content: fullContent,
                };
              }
              return updated;
            });
          });
        }

        const finalMessage: Message = {
          ...assistantMessage,
          content: fullContent,
        };

        if (onFinish) {
          await onFinish(finalMessage);
        }

        return assistantMessageId;
      } else {
        // 使用 HTTP API
        const response = await customFetch(api, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            ...(headers instanceof Headers ? Object.fromEntries(headers.entries()) : headers),
          },
          body: JSON.stringify({
            messages: messages(),
            data: options?.data,
            experimental_attachments: options?.experimental_attachments,
            ...body,
          }),
          credentials,
          signal: abortController.signal,
        });

        if (onResponse) {
          await onResponse(response);
        }

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const reader = response.body?.getReader();
        const decoder = new TextDecoder();

        if (!reader) {
          throw new Error('Response body is not readable');
        }

        let assistantMessageId = customGenerateId();
        let assistantMessage: Message = {
          id: assistantMessageId,
          role: 'assistant',
          content: '',
          createdAt: new Date(),
        };

        batch(() => {
          setMessages((prev) => [...prev, assistantMessage]);
        });

        let fullContent = '';
        let buffer = '';

        while (true) {
          const { done, value } = await reader.read();
          if (done) {
            // 处理剩余的 buffer
            if (buffer.trim()) {
              const lines = buffer.split('\n').filter((line) => line.trim());
              for (const line of lines) {
                if (line.startsWith('0:') || line.startsWith('data: ')) {
                  try {
                    const jsonStr = line.startsWith('0:') ? line.slice(2) : line.slice(6);
                    const data = JSON.parse(jsonStr);
                    if (data.type === 'text-delta' && data.textDelta) {
                      fullContent += data.textDelta;
                    } else if (data.choices?.[0]?.delta?.content) {
                      fullContent += data.choices[0].delta.content;
                    } else if (data.content) {
                      fullContent += data.content;
                    }
                  } catch (e) {
                    // Ignore parse errors
                  }
                } else if (line.trim() && !line.startsWith('0:') && !line.startsWith('data:')) {
                  // 直接文本内容
                  fullContent += line;
                }
              }
            }
            break;
          }

          buffer += decoder.decode(value, { stream: true });
          const lines = buffer.split('\n');
          buffer = lines.pop() || ''; // 保留最后一个不完整的行

          for (const line of lines) {
            if (!line.trim()) continue;

            if (line.startsWith('0:')) {
              try {
                const data = JSON.parse(line.slice(2));
                if (data.type === 'text-delta' && data.textDelta) {
                  fullContent += data.textDelta;
                } else if (data.type === 'message' && data.message?.content) {
                  fullContent = data.message.content;
                }
              } catch (e) {
                // Ignore parse errors
              }
            } else if (line.startsWith('data: ')) {
              try {
                const data = JSON.parse(line.slice(6));
                if (data.choices?.[0]?.delta?.content) {
                  fullContent += data.choices[0].delta.content;
                } else if (data.choices?.[0]?.text) {
                  fullContent += data.choices[0].text;
                } else if (data.content) {
                  fullContent += data.content;
                }
              } catch (e) {
                // Ignore parse errors
              }
            } else if (line.trim() && !line.startsWith('0:') && !line.startsWith('data:')) {
              // 直接文本内容（某些 API 可能直接返回文本）
              fullContent += line;
            }
          }

          // 更新助手消息
          batch(() => {
            setMessages((prev) => {
              const updated = [...prev];
              const index = updated.findIndex((m) => m.id === assistantMessageId);
              if (index !== -1) {
                updated[index] = {
                  ...updated[index],
                  content: fullContent,
                };
              }
              return updated;
            });
          });
        }

        const finalMessage: Message = {
          ...assistantMessage,
          content: fullContent,
        };

        if (onFinish) {
          await onFinish(finalMessage);
        }

        return assistantMessageId;
      }
    } catch (err: any) {
      if (err.name === 'AbortError') {
        return null;
      }

      const error = err instanceof Error ? err : new Error(String(err));
      setError(error);

      if (onError) {
        onError(error);
      }

      if (!keepLastMessageOnError) {
        batch(() => {
          setMessages((prev) => prev.filter((m) => m.id !== messageId));
        });
      }

      return null;
    } finally {
      setIsLoading(false);
      setAbortController(null);
    }
  };

  const reload = async (): Promise<string | null> => {
    const lastMessage = messages()[messages().length - 1];
    if (!lastMessage || lastMessage.role !== 'assistant') {
      return null;
    }

    batch(() => {
      setMessages((prev) => prev.slice(0, -1));
    });

    return append(
      { role: 'user', content: '' },
      { data: body }
    );
  };

  const stop = () => {
    const controller = abortController();
    if (controller) {
      controller.abort();
      setAbortController(null);
    }
    setIsLoading(false);
  };

  const handleInputChange = (e: Event | { target: { value: string } }) => {
    let value = '';
    if ('target' in e && e.target) {
      const target = e.target as HTMLInputElement | HTMLTextAreaElement;
      value = target.value || '';
    } else if ('currentTarget' in e && e.currentTarget) {
      const target = e.currentTarget as HTMLInputElement | HTMLTextAreaElement;
      value = target.value || '';
    } else if ('target' in e && typeof e.target === 'object' && e.target !== null && 'value' in e.target) {
      value = (e.target as { value: string }).value || '';
    }
    setInput(value);
  };

  const handleSubmit = (
    e: Event,
    options?: { data?: any; experimental_attachments?: any }
  ) => {
    e.preventDefault();
    const inputValue = input().trim();
    if (!inputValue || isLoading()) return;

    append(
      { role: 'user', content: inputValue },
      options
    ).then(() => {
      setInput('');
    });
  };

  onCleanup(() => {
    stop();
  });

  return {
    messages,
    error,
    append,
    reload,
    stop,
    setMessages,
    setInput,
    input,
    handleInputChange,
    handleSubmit,
    isLoading,
  };
}
