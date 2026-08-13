import { createServerFn } from "@tanstack/react-start";

function writeString(view: DataView, offset: number, string: string) {
  for (let i = 0; i < string.length; i++) {
    view.setUint8(offset + i, string.charCodeAt(i));
  }
}

function createWavHeader(pcmDataLength: number, sampleRate: number, numChannels: number, bitsPerSample: number) {
  const header = new ArrayBuffer(44);
  const view = new DataView(header);
  
  // RIFF chunk descriptor
  writeString(view, 0, 'RIFF');
  view.setUint32(4, 36 + pcmDataLength, true); // true = little-endian
  writeString(view, 8, 'WAVE');
  
  // fmt sub-chunk
  writeString(view, 12, 'fmt ');
  view.setUint32(16, 16, true); // Subchunk1Size (16 for PCM)
  view.setUint16(20, 1, true); // AudioFormat (1 for PCM)
  view.setUint16(22, numChannels, true); // NumChannels
  view.setUint32(24, sampleRate, true); // SampleRate
  view.setUint32(28, sampleRate * numChannels * (bitsPerSample / 8), true); // ByteRate
  view.setUint16(32, numChannels * (bitsPerSample / 8), true); // BlockAlign
  view.setUint16(34, bitsPerSample, true); // BitsPerSample
  
  // data sub-chunk
  writeString(view, 36, 'data');
  view.setUint32(40, pcmDataLength, true);
  
  return Buffer.from(header);
}

export const generateTTS = createServerFn({ method: "POST" })
  .validator((d: { text: string }) => d)
  .handler(async ({ data: { text } }) => {
    // The user will set GEMINI_API_KEY in .env
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      throw new Error("GEMINI_API_KEY is not configured.");
    }

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          contents: [
            {
              parts: [{ text }],
            },
          ],
          generationConfig: {
            responseModalities: ["audio"],
            speechConfig: {
              voiceConfig: {
                prebuiltVoiceConfig: {
                  voiceName: "Aoede", // Aoede is a great voice for this
                },
              },
            },
          },
        }),
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Gemini TTS Error:", errorText);
      throw new Error(`Failed to generate TTS: ${response.statusText}`);
    }

    const result = await response.json();
    const inlineData = result.candidates?.[0]?.content?.parts?.[0]?.inlineData;
    
    if (!inlineData || !inlineData.data) {
      console.error("Unexpected Gemini API response:", JSON.stringify(result, null, 2));
      throw new Error("Invalid response from Gemini API: no audio data found.");
    }

    // Gemini returns raw PCM audio at 24kHz, 16-bit, mono.
    // We need to wrap it in a WAV header for the browser to play it.
    const pcmBuffer = Buffer.from(inlineData.data, "base64");
    const wavHeader = createWavHeader(pcmBuffer.length, 24000, 1, 16);
    const fullWavBuffer = Buffer.concat([wavHeader, pcmBuffer]);

    return fullWavBuffer.toString("base64");
  });
