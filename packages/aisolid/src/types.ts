/**
 * AI Solid 类型定义
 * 移植自 Vercel AI SDK React 包
 */

export interface Message {
  id: string;
  role: 'system' | 'user' | 'assistant' | 'function' | 'data' | 'tool';
  content: string;
  createdAt?: Date;
  name?: string;
  function_call?: {
    name: string;
    arguments: string;
  };
  tool_calls?: Array<{
    id: string;
    type: 'function';
    function: {
      name: string;
      arguments: string;
    };
  }>;
  tool_call_id?: string;
}

export interface UseChatOptions {
  api?: string;
  id?: string;
  initialMessages?: Message[];
  initialInput?: string;
  maxSteps?: number;
  onResponse?: (response: Response) => void | Promise<void>;
  onFinish?: (message: Message) => void | Promise<void>;
  onError?: (error: Error) => void;
  headers?: Record<string, string> | Headers;
  body?: Record<string, any>;
  credentials?: RequestCredentials;
  generateId?: () => string;
  keepLastMessageOnError?: boolean;
  maxBodyLength?: number;
  streamProtocol?: 'data' | 'text' | 'ndjson';
  fetch?: typeof fetch;
  experimental_onFunctionCall?: (functionCall: {
    name: string;
    arguments: string;
  }) => Promise<any>;
  experimental_onToolCall?: (toolCall: {
    toolCallId: string;
    toolName: string;
    args: Record<string, unknown>;
  }) => Promise<any>;
  sendExtraMessageFields?: boolean;
}

export interface UseChatHelpers {
  messages: () => Message[];
  error: () => Error | undefined;
  append: (message: Message | Pick<Message, 'role' | 'content'>, options?: { data?: any; experimental_attachments?: any }) => Promise<string | null>;
  reload: () => Promise<string | null>;
  stop: () => void;
  setMessages: (messages: Message[]) => void;
  setInput: (input: string) => void;
  input: () => string;
  handleInputChange: (e: Event | { target: { value: string } }) => void;
  handleSubmit: (e: Event, options?: { data?: any; experimental_attachments?: any }) => void;
  isLoading: () => boolean;
}

export interface UseCompletionOptions {
  api?: string;
  id?: string;
  initialCompletion?: string;
  initialInput?: string;
  onResponse?: (response: Response) => void | Promise<void>;
  onFinish?: (prompt: string, completion: string) => void | Promise<void>;
  onError?: (error: Error) => void;
  headers?: Record<string, string> | Headers;
  body?: Record<string, any>;
  credentials?: RequestCredentials;
  maxTokens?: number;
  streamProtocol?: 'data' | 'text' | 'ndjson';
  fetch?: typeof fetch;
  keepLastMessageOnError?: boolean;
}

export interface UseCompletionHelpers {
  completion: () => string;
  complete: (prompt: string, options?: { body?: any; headers?: HeadersInit }) => Promise<string | null>;
  error: () => Error | undefined;
  stop: () => void;
  input: () => string;
  setInput: (input: string) => void;
  handleInputChange: (e: Event | { target: { value: string } }) => void;
  handleSubmit: (e: Event) => void;
  isLoading: () => boolean;
}
