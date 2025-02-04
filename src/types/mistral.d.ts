declare module '@mistralai/mistralai' {
  interface ChatMessage {
    role: 'system' | 'user' | 'assistant';
    content: string;
  }

  interface ChatResponse {
    messages: Array<{
      role: string;
      content: string;
    }>;
  }

  interface ChatOptions {
    model: string;
    messages: ChatMessage[];
  }

  class MistralClient {
    constructor(apiKey: string);
    chat(options: ChatOptions): Promise<ChatResponse>;
  }

  export = MistralClient;
} 