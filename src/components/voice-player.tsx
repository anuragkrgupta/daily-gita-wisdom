import { Square, Volume2 } from "lucide-react";
import { useVerseAudio } from "../hooks/useVerseAudio";

interface VoicePlayerProps {
  sanskrit?: string;
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
  const { play, stop, state } = useVerseAudio();

  const handleToggle = () => {
    if (state === "playing" || state === "loading") {
      stop();
    } else {
      const parts = [];
      if (sanskrit) parts.push(sanskrit.replace(/\n/g, "। ")); // replace newlines with danda for better pacing
      parts.push(hindi);
      parts.push("In English.");
      parts.push(english);
      play(parts.join(" ... "));
    }
  };

  const isPlaying = state === "playing" || state === "loading";

  return (
    <button
      type="button"
      onClick={handleToggle}
      aria-label={isPlaying ? "Stop reading verse" : label}
      aria-pressed={isPlaying}
      className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-semibold uppercase tracking-wider transition ${
        isPlaying
          ? "border-primary bg-primary text-primary-foreground"
          : "border-primary/40 bg-card/70 text-primary hover:bg-primary hover:text-primary-foreground"
      }`}
    >
      {isPlaying ? (
        <Square size={13} fill="currentColor" />
      ) : (
        <Volume2 size={14} />
      )}
      {state === "loading" ? "Loading" : isPlaying ? "Stop" : "Listen"}
    </button>
  );
}
