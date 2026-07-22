import { Square, Volume2 } from "lucide-react";
import { useEffect, useState } from "react";

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
  const [isSupported, setIsSupported] = useState(false);

  useEffect(() => {
    setIsSupported("speechSynthesis" in window && "SpeechSynthesisUtterance" in window);

    return () => {
      window.speechSynthesis?.cancel();
    };
  }, []);

  const stop = () => {
    window.speechSynthesis.cancel();
    setIsPlaying(false);
  };

  const speak = () => {
    if (!isSupported) return;

    if (isPlaying) {
      stop();
      return;
    }

    window.speechSynthesis.cancel();
    const voices = window.speechSynthesis.getVoices();
    const utterances = [
      createUtterance(sanskrit, "hi-IN", voices),
      createUtterance(`इसका अर्थ है। ${hindi}`, "hi-IN", voices),
      createUtterance(`Now in English. ${english}`, "en-US", voices),
    ];
    utterances.at(-1)!.onend = () => setIsPlaying(false);
    utterances.forEach((utterance) => window.speechSynthesis.speak(utterance));
    setIsPlaying(true);
  };

  if (!isSupported) return null;

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

function createUtterance(text: string, lang: string, voices: SpeechSynthesisVoice[]) {
  const utterance = new SpeechSynthesisUtterance(text.replaceAll("\n", ". "));
  utterance.lang = lang;
  utterance.voice = findMaleVoice(lang, voices);
  utterance.rate = 0.7;
  utterance.pitch = 1;
  utterance.onerror = () => undefined;
  return utterance;
}

function findMaleVoice(lang: string, voices: SpeechSynthesisVoice[]) {
  const languageVoices = voices.filter((voice) =>
    voice.lang.toLowerCase().startsWith(lang.slice(0, 2)),
  );
  const maleVoice = languageVoices.find((voice) =>
    /male|madhur|hemant|ravi|david|mark|alex|daniel|james|george|guy|thomas/i.test(voice.name),
  );

  return maleVoice ?? languageVoices[0];
}
