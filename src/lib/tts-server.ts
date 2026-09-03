import { createServerFn } from "@tanstack/react-start";
import { MsEdgeTTS, OUTPUT_FORMAT } from "msedge-tts";
import { getCachedAudio, setCachedAudio } from "./tts-cache";

export const generateTTS = createServerFn()
  .validator((data: { text: string; rate?: string; pitch?: string }) => data)
  .handler(async ({ data }) => {
    const { text, rate = "-15%", pitch = "-5Hz" } = data;
    const voice = "hi-IN-MadhurNeural";

    try {
      const cached = await getCachedAudio(text, voice);
      if (cached) {
        return cached.toString("base64");
      }

      const tts = new MsEdgeTTS();
      await tts.setMetadata(voice, OUTPUT_FORMAT.AUDIO_24KHZ_48KBITRATE_MONO_MP3);

      const { audioStream } = await tts.toStream(text, { rate, pitch });

      const chunks: Buffer[] = [];
      for await (const chunk of audioStream) chunks.push(chunk);
      const audioBuffer = Buffer.concat(chunks);

      setCachedAudio(text, voice, audioBuffer);

      return audioBuffer.toString("base64");
    } catch (err: any) {
      console.error("Edge TTS generation failed:", err);
      throw new Error("TTS generation failed");
    }
  });
