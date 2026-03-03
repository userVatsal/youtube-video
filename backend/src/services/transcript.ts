import fs from 'fs';
import axios from 'axios';

export async function transcribeWithWhisper(filePath: string): Promise<string> {
  // this function assumes you have an OPENAI_API_KEY with Whisper access
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) throw new Error('OPENAI_API_KEY not set');
  const formData = new FormData();
  formData.append('file', fs.createReadStream(filePath));
  formData.append('model', 'whisper-1');
  const resp = await axios.post('https://api.openai.com/v1/audio/transcriptions', formData, {
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      ...formData.getHeaders(),
    },
  });
  return resp.data.text;
}
