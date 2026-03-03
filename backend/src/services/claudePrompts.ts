export const segmentationPrompt = (transcript: string) => `Transcript:
"${transcript}"

Task: split into logical chapters and output JSON:
{ chapters: [{ start, end, title }], niche: "", audienceType: "" }
`;

export const stylePrompt = (clipText: string, style: string) => `Script:
"${clipText}"

Style: ${style}, tone energetic, length 30s.

Include punchy hooks, CTAs, pattern interrupts.
Return JSON: { scenes: [{ start, end, text }] }.
`;
