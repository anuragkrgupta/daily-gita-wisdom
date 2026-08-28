import { Square, Volume2 } from "lucide-react";
import { useEffect, useState } from "react";

interface VoicePlayerProps {
  hindi: string;
  english: string;
  label?: string;
}

export function VoicePlayer({ hindi, english, label = "Listen to verse" }: VoicePlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isSupported, setIsSupported] = useState(true);
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);

  useEffect(() => {
    if (typeof window === "undefined" || !("speechSynthesis" in window)) {
      setIsSupported(false);
      return;
    }

    const loadVoices = () => {
      setVoices(window.speechSynthesis.getVoices());
    };

    loadVoices();
    if (window.speechSynthesis.onvoiceschanged !== undefined) {
      window.speechSynthesis.onvoiceschanged = loadVoices;
    }

    // Cleanup speech on unmount
    return () => {
      window.speechSynthesis.cancel();
    };
  }, []);

  const stop = () => {
    if (typeof window !== "undefined" && window.speechSynthesis) {
      window.speechSynthesis.cancel();
    }
    setIsPlaying(false);
  };

  const speak = () => {
    if (isPlaying) {
      stop();
      return;
    }

    if (typeof window === "undefined" || !window.speechSynthesis) return;

    window.speechSynthesis.cancel();

    // Try to find appropriate voices
    const hindiVoice = voices.find((v) => v.lang.toLowerCase().startsWith("hi")) || null;
    const englishVoice =
      voices.find((v) => v.lang.toLowerCase().startsWith("en-us")) ||
      voices.find((v) => v.lang.toLowerCase().startsWith("en")) ||
      null;

    const hindiUtterance = new SpeechSynthesisUtterance(hindi);
    if (hindiVoice) {
      hindiUtterance.voice = hindiVoice;
    }
    hindiUtterance.lang = "hi-IN";

    const englishUtterance = new SpeechSynthesisUtterance(`Now in English. ${english}`);
    if (englishVoice) {
      englishUtterance.voice = englishVoice;
    }
    englishUtterance.lang = "en-US";

    // Manage state correctly across multiple utterances
    let hindiFailed = false;

    hindiUtterance.onstart = () => setIsPlaying(true);
    hindiUtterance.onerror = (e) => {
      console.warn("Hindi TTS failed or skipped:", e);
      hindiFailed = true;
    };
    // We don't set isPlaying(false) on hindiUtterance.onend because english is queued next.

    englishUtterance.onstart = () => setIsPlaying(true);
    englishUtterance.onend = () => setIsPlaying(false);
    englishUtterance.onerror = (e) => {
      console.warn("English TTS failed:", e);
      setIsPlaying(false);
    };

    window.speechSynthesis.speak(hindiUtterance);
    window.speechSynthesis.speak(englishUtterance);

    // Failsafe: if nothing plays after a short delay, reset state
    setTimeout(() => {
      if (!window.speechSynthesis.speaking && !window.speechSynthesis.pending) {
        setIsPlaying(false);
      }
    }, 500);
  };

  if (!isSupported) {
    return null;
  }

  return (
    <button
      type="button"
      onClick={speak}
      aria-label={isPlaying ? "Stop reading verse" : label}
      aria-pressed={isPlaying}
      className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-semibold uppercase tracking-wider transition ${
        isPlaying
          ? "border-primary bg-primary text-primary-foreground"
          : "border-primary/40 bg-card/70 text-primary hover:bg-primary hover:text-primary-foreground"
      }`}
    >
      {isPlaying ? <Square size={13} fill="currentColor" /> : <Volume2 size={14} />}
      {isPlaying ? "Stop" : "Listen"}
    </button>
  );
}
