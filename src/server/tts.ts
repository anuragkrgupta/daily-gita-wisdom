import { createServerFn } from "@tanstack/react-start";

export const generateTTS = createServerFn({ method: "POST" })
  .validator((d: { text: string }) => d)
  .handler(async ({ data: { text } }) => {
    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
      throw new Error("OPENAI_API_KEY is not configured.");
    }

    const response = await fetch("https://api.openai.com/v1/audio/speech", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: "tts-1",
        voice: "shimmer", // 'shimmer' is clear and expressive
        input: text,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("OpenAI TTS Error:", errorText);
      throw new Error(`Failed to generate TTS: ${response.statusText}`);
    }

    const arrayBuffer = await response.arrayBuffer();
    return Buffer.from(arrayBuffer).toString("base64");
  });
