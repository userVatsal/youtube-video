import { callClaude } from './claudeClient';
import { stylePrompt } from './claudePrompts';

export async function rewriteScript(style: string, script: string, options: any): Promise<string> {
  const prompt = stylePrompt(script, style);
  const result = await callClaude(prompt);
  // naive: return text field
  return result?.completion || script;
}
