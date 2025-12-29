/**
 * useCompletion hook - 用于文本补全
 * 移植自 Vercel AI SDK React 包
 */

import { createSignal, createEffect, onCleanup, batch } from 'solid-js';
import type { UseCompletionOptions, UseCompletionHelpers } from '../types';

export function useCompletion(options: UseCompletionOptions = {}): UseCompletionHelpers {
  const {
    api = '/api/completion',
    id,
    initialCompletion = '',
    initialInput = '',
    onResponse,
    onFinish,
    onError,
    headers,
    body,
    credentials,
    fetch: customFetch = fetch,
    keepLastMessageOnError = false,
  } = options;

  const [completion, setCompletion] = createSignal(initialCompletion);
  const [input, setInput] = createSignal(initialInput);
  const [isLoading, setIsLoading] = createSignal(false);
  const [error, setError] = createSignal<Error | undefined>(undefined);
  const [abortController, setAbortController] = createSignal<AbortController | null>(null);

  // 从 localStorage 恢复状态（如果提供了 id）
  createEffect(() => {
    if (id && typeof window !== 'undefined') {
      try {
        const stored = localStorage.getItem(`ai-completion-${id}`);
        if (stored) {
          const parsed = JSON.parse(stored);
          if (parsed.completion) setCompletion(parsed.completion);
          if (parsed.input) setInput(parsed.input);
        }
      } catch (e) {
        // Ignore parse errors
      }
    }
  });

  // 保存状态到 localStorage
  createEffect(() => {
    if (id && typeof window !== 'undefined') {
      try {
        localStorage.setItem(
          `ai-completion-${id}`,
          JSON.stringify({
            completion: completion(),
            input: input(),
          })
        );
      } catch (e) {
        // Ignore storage errors
      }
    }
  });

  const complete = async (
    prompt: string,
    options?: { body?: any; headers?: HeadersInit }
  ): Promise<string | null> => {
    batch(() => {
      setCompletion('');
      setIsLoading(true);
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
          ...(options?.headers instanceof Headers
            ? Object.fromEntries(options.headers.entries())
            : options?.headers),
        },
        body: JSON.stringify({
          prompt,
          ...body,
          ...options?.body,
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

      let fullCompletion = '';
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
                    fullCompletion += data.textDelta;
                  } else if (data.type === 'completion' && data.completion) {
                    fullCompletion = data.completion;
                  } else if (data.choices?.[0]?.text) {
                    fullCompletion += data.choices[0].text;
                  }
                } catch (e) {
                  // Ignore parse errors
                }
              } else if (line.trim()) {
                fullCompletion += line;
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
                fullCompletion += data.textDelta;
              } else if (data.type === 'completion' && data.completion) {
                fullCompletion = data.completion;
              }
            } catch (e) {
              // Ignore parse errors
            }
          } else if (line.startsWith('data: ')) {
            try {
              const data = JSON.parse(line.slice(6));
              if (data.choices?.[0]?.delta?.text) {
                fullCompletion += data.choices[0].delta.text;
              } else if (data.choices?.[0]?.text) {
                fullCompletion += data.choices[0].text;
              } else if (data.text) {
                fullCompletion += data.text;
              }
            } catch (e) {
              // Ignore parse errors
            }
          } else if (line.trim() && !line.startsWith('0:') && !line.startsWith('data:')) {
            // 直接文本内容
            fullCompletion += line;
          }
        }

        // 更新补全内容
        setCompletion(fullCompletion);
      }

      if (onFinish) {
        await onFinish(prompt, fullCompletion);
      }

      return fullCompletion;
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
        setCompletion('');
      }

      return null;
    } finally {
      setIsLoading(false);
      setAbortController(null);
    }
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

  const handleSubmit = (e: Event) => {
    e.preventDefault();
    const inputValue = input().trim();
    if (!inputValue || isLoading()) return;

    complete(inputValue).then(() => {
      setInput('');
    });
  };

  onCleanup(() => {
    stop();
  });

  return {
    completion,
    complete,
    error,
    stop,
    input,
    setInput,
    handleInputChange,
    handleSubmit,
    isLoading,
  };
}
