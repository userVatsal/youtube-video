import axios from 'axios';

const CLAUDE_API_URL = 'https://api.anthropic.com/v1/complete';
const apiKey = process.env.CLAUDE_API_KEY;

if (!apiKey) {
  console.warn('CLAUDE_API_KEY not set, Claude calls will fail');
}

export async function callClaude(prompt: string): Promise<any> {
  const resp = await axios.post(
    CLAUDE_API_URL,
    {
      model: 'claude-2.1',
      prompt,
      max_tokens: 2000,
    },
    {
      headers: {
        'x-api-key': apiKey,
        'Content-Type': 'application/json',
      },
    }
  );
  return resp.data;
}
