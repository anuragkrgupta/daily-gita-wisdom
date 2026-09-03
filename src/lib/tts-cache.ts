import { createHash } from "crypto";
import fs from "fs/promises";
import path from "path";
import os from "os";

// Use /tmp for serverless compatibility (Vercel)
const CACHE_DIR = path.join(os.tmpdir(), ".tts-cache");

export async function getCachedAudio(text: string, voice: string) {
  await fs.mkdir(CACHE_DIR, { recursive: true });
  const key = createHash("sha256").update(`${voice}:${text}`).digest("hex");
  const filePath = path.join(CACHE_DIR, `${key}.mp3`);

  try {
    return await fs.readFile(filePath);
  } catch {
    return null; // not cached yet
  }
}

export async function setCachedAudio(text: string, voice: string, audioBuffer: Buffer) {
  await fs.mkdir(CACHE_DIR, { recursive: true });
  const key = createHash("sha256").update(`${voice}:${text}`).digest("hex");
  const filePath = path.join(CACHE_DIR, `${key}.mp3`);

  try {
    await fs.writeFile(filePath, audioBuffer);
  } catch (err) {
    console.error("Failed to write TTS cache:", err);
  }
}
