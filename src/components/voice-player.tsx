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

  useEffect(() => {
    const supported = "speechSynthesis" in window && "SpeechSynthesisUtterance" in window;

    // Voice lists load asynchronously in most browsers (esp. Chrome). Force a
    // load and refresh once the real list arrives so we don't get stuck with
    // an empty voices array on the first play.
    if (supported) {
      window.speechSynthesis.getVoices();
      window.speechSynthesis.onvoiceschanged = () => {
        window.speechSynthesis.getVoices();
      };
    }

    return () => {
      window.speechSynthesis?.cancel();
    };
  }, []);

  const stop = () => {
    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      window.speechSynthesis.cancel();
    }
    setIsPlaying(false);
  };

  const speak = async () => {
    if (typeof window === "undefined" || !("speechSynthesis" in window)) return;

    if (isPlaying) {
      stop();
      return;
    }

    window.speechSynthesis.cancel();
    const voices = await getVoicesAsync();

    const utterances = [
      // Sanskrit is spoken slower and slightly lower-pitched for crisp,
      // clearly-enunciated syllables (long conjuncts read poorly if rushed).
      createUtterance(processSanskritTextForTTS(sanskrit), "hi-IN", voices, "sanskrit"),
      createUtterance(`इसका अर्थ है। ${hindi}`, "hi-IN", voices, "translation"),
      createUtterance(`Now in English. ${english}`, "en-US", voices, "translation"),
    ];
    utterances.at(-1)!.onend = () => setIsPlaying(false);
    utterances.forEach((utterance) => window.speechSynthesis.speak(utterance));
    setIsPlaying(true);
  };

  // Chrome (and some mobile browsers) populate speechSynthesis.getVoices()
  // asynchronously, so a fresh page load can return an empty array on the
  // first call. This waits (briefly) for the real voice list.
  const getVoicesAsync = (): Promise<SpeechSynthesisVoice[]> => {
    const existing = window.speechSynthesis.getVoices();
    if (existing.length > 0) return Promise.resolve(existing);

    return new Promise((resolve) => {
      const timeout = setTimeout(() => resolve(window.speechSynthesis.getVoices()), 500);
      window.speechSynthesis.onvoiceschanged = () => {
        clearTimeout(timeout);
        resolve(window.speechSynthesis.getVoices());
      };
    });
  };

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

type Segment = "sanskrit" | "translation";

// Transforms Sanskrit text to make Hindi TTS engines pronounce it more clearly.
// - Adds pauses at dandas (।, ॥) and newlines.
// - Replaces visarga (ः) with 'ह' (ha) because Hindi TTS often drops visargas,
//   and 'ha' mimics the echoing breath of Sanskrit visarga.
// - Removes avagraha (ऽ) to prevent TTS glitches.
function processSanskritTextForTTS(text: string) {
  let processed = text;
  
  // Replace dandas with periods for strong pauses
  processed = processed.replace(/॥/g, ".");
  processed = processed.replace(/।/g, ",");
  
  // Hindi TTS often ignores visarga. Replacing with 'ह' forces it to sound out the breath.
  processed = processed.replace(/ः/g, "ह ");
  
  // Avagraha is silent in pronunciation, just slightly elongates. Hindi TTS might glitch on it.
  processed = processed.replace(/ऽ/g, "");

  return processed
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean)
    // Add multiple periods to force a noticeable, deliberate breath between lines
    .join(". . ");
}

function createUtterance(
  text: string,
  lang: string,
  voices: SpeechSynthesisVoice[],
  segment: Segment,
) {
  const utterance = new SpeechSynthesisUtterance(text.replaceAll("\n", ". "));
  utterance.lang = lang;
  utterance.voice = findBestMaleVoice(lang, voices);

  if (segment === "sanskrit") {
    // Slower and a touch lower for crisp, clearly separated syllables.
    // Gives a more resonant, chanting-like quality.
    utterance.rate = 0.55;
    utterance.pitch = 0.85;
  } else {
    utterance.rate = 0.85;
    utterance.pitch = 1;
  }

  utterance.volume = 1;
  utterance.onerror = () => undefined;
  return utterance;
}

// Known high-quality male voice names across major engines (Google, Microsoft
// Edge/Windows neural voices, Apple), roughly in order of naturalness. Names
// vary by OS/browser, so we match on any of them rather than assuming one.
const PREFERRED_MALE_VOICES = [
  // Microsoft neural/natural voices (Edge, Windows) - Indian & general
  "hemant",
  "madhur",
  "ravi",
  "prabhat",
  "arnav",
  "guy",
  // Google
  "google uk english male",
  "google us english male",
  // Apple
  "daniel",
  "rishi",
  "thomas",
  "alex",
  // Generic fallbacks
  "david",
  "mark",
  "james",
  "george",
];

function findBestMaleVoice(lang: string, voices: SpeechSynthesisVoice[]) {
  const langPrefix = lang.slice(0, 2).toLowerCase();
  const languageVoices = voices.filter((voice) => voice.lang.toLowerCase().startsWith(langPrefix));
  const pool = languageVoices.length > 0 ? languageVoices : voices;

  // 1. Exact match against known-good male voice names for this language.
  for (const name of PREFERRED_MALE_VOICES) {
    const match = pool.find((voice) => voice.name.toLowerCase().includes(name));
    if (match) return match;
  }

  // 2. Anything whose name/lang explicitly says "male".
  const explicitMale = pool.find((voice) => /\bmale\b/i.test(voice.name));
  if (explicitMale) return explicitMale;

  // 3. Avoid obviously female-labelled voices, then take the first local
  // (non-network) voice for reliability, otherwise whatever is first.
  const notFemale = pool.filter(
    (voice) => !/female|\bwoman\b|zira|susan|samantha|lekha|veena/i.test(voice.name),
  );
  const candidates = notFemale.length > 0 ? notFemale : pool;
  const localVoice = candidates.find((voice) => voice.localService);

  return localVoice ?? candidates[0] ?? languageVoices[0];
}
