interface Message {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

interface DeepSeekResponse {
  choices: {
    message: {
      content: string;
      role: string;
    };
    finish_reason: string;
  }[];
  usage?: {
    prompt_tokens: number;
    completion_tokens: number;
    total_tokens: number;
  };
}

export class DeepSeekClient {
  private apiKey: string;
  private apiUrl: string;

  constructor(apiKey?: string, apiUrl?: string) {
    this.apiKey = apiKey || process.env.DEEPSEEK_API_KEY || '';
    this.apiUrl = apiUrl || process.env.DEEPSEEK_API_URL || 'https://api.deepseek.com/v1';
  }

  async generateCompletion(
    messages: Message[],
    model: string = 'deepseek-chat',
    temperature: number = 0.7,
    maxTokens: number = 2000
  ): Promise<string> {
    try {
      const response = await fetch(`${this.apiUrl}/chat/completions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.apiKey}`,
        },
        body: JSON.stringify({
          model,
          messages,
          temperature,
          max_tokens: maxTokens,
          stream: false,
        }),
      });

      if (!response.ok) {
        throw new Error(`DeepSeek API error: ${response.statusText}`);
      }

      const data: DeepSeekResponse = await response.json();
      
      if (data.choices && data.choices.length > 0) {
        return data.choices[0].message.content;
      }

      throw new Error('No response from DeepSeek API');
    } catch (error) {
      console.error('DeepSeek API Error:', error);
      throw error;
    }
  }

  async generateStreamCompletion(
    messages: Message[],
    model: string = 'deepseek-chat',
    temperature: number = 0.7,
    maxTokens: number = 2000,
    onChunk: (chunk: string) => void
  ): Promise<void> {
    try {
      const response = await fetch(`${this.apiUrl}/chat/completions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.apiKey}`,
        },
        body: JSON.stringify({
          model,
          messages,
          temperature,
          max_tokens: maxTokens,
          stream: true,
        }),
      });

      if (!response.ok) {
        throw new Error(`DeepSeek API error: ${response.statusText}`);
      }

      const reader = response.body?.getReader();
      if (!reader) throw new Error('No response body');

      const decoder = new TextDecoder();
      let buffer = '';

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split('\n');
        buffer = lines.pop() || '';

        for (const line of lines) {
          if (line.startsWith('data: ')) {
            const data = line.slice(6);
            if (data === '[DONE]') continue;

            try {
              const parsed = JSON.parse(data);
              if (parsed.choices?.[0]?.delta?.content) {
                onChunk(parsed.choices[0].delta.content);
              }
            } catch (e) {
              console.error('Error parsing SSE chunk:', e);
            }
          }
        }
      }
    } catch (error) {
      console.error('DeepSeek Stream Error:', error);
      throw error;
    }
  }
}

export const deepseek = new DeepSeekClient();