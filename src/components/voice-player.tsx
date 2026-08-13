import { Square, Volume2 } from "lucide-react";
import { useEffect, useState, useRef } from "react";
import { generateTTS } from "../server/tts";

interface VoicePlayerProps {
  sanskrit: string;
  hindi: string;
  english: string;
  label?: string;
}

export function VoicePlayer({
  sanskrit,
  hindi,
  english,
  label = "Listen to verse",
}: VoicePlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    // Cleanup audio on unmount
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.src = "";
      }
    };
  }, []);

  const stop = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
    setIsPlaying(false);
    setIsLoading(false);
  };

  const speak = async () => {
    if (isPlaying || isLoading) {
      stop();
      return;
    }

    try {
      setIsLoading(true);

      // Concatenate the script for a seamless single audio clip
      const script = `${sanskrit}\n\nइसका अर्थ है।\n${hindi}\n\nNow in English.\n${english}`;
      
      const base64Audio = await generateTTS({ data: { text: script } });
      
      if (!audioRef.current) {
        audioRef.current = new Audio();
        audioRef.current.onended = () => setIsPlaying(false);
        audioRef.current.onerror = () => {
          setIsPlaying(false);
          setIsLoading(false);
          console.error("Audio playback error");
        };
      }
      
      audioRef.current.src = `data:audio/wav;base64,${base64Audio}`;
      await audioRef.current.play();
      
      setIsPlaying(true);
      setIsLoading(false);
    } catch (error) {
      console.error("TTS generation failed:", error);
      setIsLoading(false);
      setIsPlaying(false);
    }
  };

  return (
    <button
      type="button"
      onClick={speak}
      disabled={isLoading && !isPlaying}
      aria-label={isPlaying ? "Stop reading verse" : label}
      aria-pressed={isPlaying}
      className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-semibold uppercase tracking-wider transition ${
        isPlaying || isLoading
          ? "border-primary bg-primary text-primary-foreground"
          : "border-primary/40 bg-card/70 text-primary hover:bg-primary hover:text-primary-foreground"
      } ${isLoading && !isPlaying ? "opacity-70 cursor-not-allowed" : ""}`}
    >
      {isLoading && !isPlaying ? (
        <span className="animate-spin h-3.5 w-3.5 border-2 border-current border-t-transparent rounded-full" />
      ) : isPlaying ? (
        <Square size={13} fill="currentColor" />
      ) : (
        <Volume2 size={14} />
      )}
      {isLoading && !isPlaying ? "Loading" : isPlaying ? "Stop" : "Listen"}
    </button>
  );
}
