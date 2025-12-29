/**
 * useAssistant hook - 用于助手对话
 * 移植自 Vercel AI SDK React 包
 */

import { createSignal, createEffect, onCleanup, batch } from 'solid-js';
import type { Message } from '../types';
import { generateId } from '../utils';

export interface UseAssistantOptions {
  api?: string;
  id?: string;
  threadId?: string;
  initialMessages?: Message[];
  initialInput?: string;
  onResponse?: (response: Response) => void | Promise<void>;
  onFinish?: (message: Message) => void | Promise<void>;
  onError?: (error: Error) => void;
  headers?: Record<string, string> | Headers;
  body?: Record<string, any>;
  credentials?: RequestCredentials;
  fetch?: typeof fetch;
}

export interface UseAssistantHelpers {
  messages: () => Message[];
  append: (message: Pick<Message, 'role' | 'content'>) => Promise<string | null>;
  status: () => 'awaiting_message' | 'in_progress' | 'error';
  error: () => Error | undefined;
  setMessages: (messages: Message[]) => void;
  setInput: (input: string) => void;
  input: () => string;
  handleInputChange: (e: Event | { target: { value: string } }) => void;
  handleSubmit: (e: Event) => void;
  stop: () => void;
}

export function useAssistant(options: UseAssistantOptions = {}): UseAssistantHelpers {
  const {
    api = '/api/assistant',
    id,
    threadId,
    initialMessages = [],
    initialInput = '',
    onResponse,
    onFinish,
    onError,
    headers,
    body,
    credentials,
    fetch: customFetch = fetch,
  } = options;

  const [messages, setMessages] = createSignal<Message[]>(initialMessages);
  const [input, setInput] = createSignal(initialInput);
  const [status, setStatus] = createSignal<'awaiting_message' | 'in_progress' | 'error'>('awaiting_message');
  const [error, setError] = createSignal<Error | undefined>(undefined);
  const [abortController, setAbortController] = createSignal<AbortController | null>(null);

  // 从 localStorage 恢复消息（如果提供了 id）
  createEffect(() => {
    if (id && typeof window !== 'undefined') {
      try {
        const stored = localStorage.getItem(`ai-assistant-${id}`);
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
        localStorage.setItem(`ai-assistant-${id}`, JSON.stringify(messages()));
      } catch (e) {
        // Ignore storage errors
      }
    }
  });

  const append = async (
    message: Pick<Message, 'role' | 'content'>
  ): Promise<string | null> => {
    const messageId = generateId();
    const userMessage: Message = {
      id: messageId,
      role: message.role,
      content: message.content,
      createdAt: new Date(),
    };

    batch(() => {
      setMessages((prev) => [...prev, userMessage]);
      setStatus('in_progress');
      setError(undefined);
    });

    const abortController = new AbortController();
    setAbortController(abortController);

    try {
      const response = await customFetch(api, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(headers instanceof Headers ? Object.fromEntries(headers.entries()) : headers),
        },
        body: JSON.stringify({
          message: message.content,
          threadId,
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

      let assistantMessageId = generateId();
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
                  } else if (data.content) {
                    fullContent += data.content;
                  }
                } catch (e) {
                  // Ignore parse errors
                }
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
              } else if (data.content) {
                fullContent += data.content;
              }
            } catch (e) {
              // Ignore parse errors
            }
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

      setStatus('awaiting_message');
      return assistantMessageId;
    } catch (err: any) {
      if (err.name === 'AbortError') {
        setStatus('awaiting_message');
        return null;
      }

      const error = err instanceof Error ? err : new Error(String(err));
      setError(error);
      setStatus('error');

      if (onError) {
        onError(error);
      }

      return null;
    } finally {
      setAbortController(null);
    }
  };

  const stop = () => {
    const controller = abortController();
    if (controller) {
      controller.abort();
      setAbortController(null);
    }
    setStatus('awaiting_message');
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

  const handleSubmit = (e: Event) => {
    e.preventDefault();
    const inputValue = input().trim();
    if (!inputValue || status() === 'in_progress') return;

    append({ role: 'user', content: inputValue }).then(() => {
      setInput('');
    });
  };

  onCleanup(() => {
    stop();
  });

  return {
    messages,
    append,
    status,
    error,
    setMessages,
    setInput,
    input,
    handleInputChange,
    handleSubmit,
    stop,
  };
}
