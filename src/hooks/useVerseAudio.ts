import { useState, useCallback, useRef } from "react";
import { getVoicesAsync } from "../lib/web-speech-voices";
import { generateTTS } from "../lib/tts-server";

type PlayState = "idle" | "loading" | "playing" | "error";

export function useVerseAudio() {
  const [state, setState] = useState<PlayState>("idle");
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const playWithWebSpeech = useCallback(async (text: string) => {
    if (typeof window === "undefined" || !("speechSynthesis" in window)) {
      setState("error");
      return;
    }

    const voices = await getVoicesAsync();
    const hindiVoice = voices.find((v) => v.lang.toLowerCase().startsWith("hi")) || null;
    
    const utterance = new SpeechSynthesisUtterance(text);
    if (hindiVoice) utterance.voice = hindiVoice;
    
    utterance.rate = 0.85;
    utterance.pitch = 0.9;
    utterance.lang = "hi-IN";

    utterance.onstart = () => setState("playing");
    utterance.onend = () => setState("idle");
    utterance.onerror = (e) => {
      console.warn("Web Speech API failed:", e);
      setState("error");
    };

    window.speechSynthesis.speak(utterance);
  }, []);

  const play = useCallback(async (text: string) => {
    setState("loading");

    try {
      // Call the server function via RPC
      const base64Audio = await generateTTS({ data: { text } });
      
      if (!base64Audio) throw new Error("No audio returned");

      // Convert base64 to blob
      const byteCharacters = atob(base64Audio);
      const byteNumbers = new Array(byteCharacters.length);
      for (let i = 0; i < byteCharacters.length; i++) {
        byteNumbers[i] = byteCharacters.charCodeAt(i);
      }
      const byteArray = new Uint8Array(byteNumbers);
      const blob = new Blob([byteArray], { type: "audio/mpeg" });

      const audio = new Audio(URL.createObjectURL(blob));
      audioRef.current = audio;

      audio.onplay = () => setState("playing");
      audio.onended = () => setState("idle");
      audio.onerror = () => {
        console.warn("Edge TTS playback failed, falling back to Web Speech");
        playWithWebSpeech(text);
      };

      await audio.play();
    } catch (err) {
      console.warn("Edge TTS request failed, falling back to Web Speech:", err);
      playWithWebSpeech(text);
    }
  }, [playWithWebSpeech]);

  const stop = useCallback(() => {
    audioRef.current?.pause();
    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      window.speechSynthesis.cancel();
    }
    setState("idle");
  }, []);

  return { play, stop, state };
}
