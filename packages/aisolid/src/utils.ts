/**
 * 工具函数
 */

import type { Message } from './types';

export function generateId(): string {
  return Math.random().toString(36).substring(2, 15);
}

export function getMessageFromResponse(response: Response): Promise<Message> {
  return response.json().then((data) => ({
    id: data.id || generateId(),
    role: data.role || 'assistant',
    content: data.content || '',
    createdAt: data.createdAt ? new Date(data.createdAt) : new Date(),
    ...data,
  }));
}

export function getStreamingResponse(
  response: Response,
  onChunk?: (chunk: string) => void
): Promise<string> {
  const reader = response.body?.getReader();
  const decoder = new TextDecoder();

  if (!reader) {
    throw new Error('Response body is not readable');
  }

  return new Promise((resolve, reject) => {
    let fullText = '';

    function pump(): Promise<void> {
      if (!reader) {
        resolve(fullText);
        return Promise.resolve();
      }
      return reader.read().then(({ done, value }) => {
        if (done) {
          resolve(fullText);
          return;
        }

        const chunk = decoder.decode(value, { stream: true });
        fullText += chunk;
        
        if (onChunk) {
          onChunk(chunk);
        }

        return pump();
      });
    }

    pump().catch(reject);
  });
}

export function parseStreamedResponse(
  chunk: string,
  onMessage?: (message: Message) => void
): Message[] {
  const lines = chunk.split('\n').filter((line) => line.trim());
  const messages: Message[] = [];

  for (const line of lines) {
    if (line.startsWith('0:')) {
      // Data protocol
      try {
        const data = JSON.parse(line.slice(2));
        if (data.type === 'text-delta' && data.textDelta) {
          // Handle text delta
        } else if (data.type === 'message' && data.message) {
          const message: Message = {
            id: data.message.id || generateId(),
            role: data.message.role || 'assistant',
            content: data.message.content || '',
            createdAt: data.message.createdAt ? new Date(data.message.createdAt) : new Date(),
            ...data.message,
          };
          messages.push(message);
          if (onMessage) {
            onMessage(message);
          }
        }
      } catch (e) {
        // Ignore parse errors
      }
    } else if (line.startsWith('data: ')) {
      // SSE protocol
      try {
        const data = JSON.parse(line.slice(6));
        if (data.choices && data.choices[0]?.delta?.content) {
          // Handle OpenAI format
        }
      } catch (e) {
        // Ignore parse errors
      }
    }
  }

  return messages;
}
