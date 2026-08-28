import { createFileRoute, Link, notFound, useNavigate } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { VoicePlayer } from "@/components/voice-player";
import { shloks } from "@/lib/shloks";
import { useFavorites } from "@/lib/favorites";

export const Route = createFileRoute("/shlok/$chapter/$verse")({
  head: ({ params }) => ({
    meta: [
      { title: `Bhagavad Gītā ${params.chapter}.${params.verse} — Daily Gita` },
      {
        name: "description",
        content: `Read Bhagavad Gītā chapter ${params.chapter}, verse ${params.verse} in Sanskrit with Hindi and English meaning.`,
      },
      {
        property: "og:title",
        content: `Bhagavad Gītā ${params.chapter}.${params.verse} — Daily Gita`,
      },
      {
        property: "og:description",
        content: `Read Bhagavad Gītā chapter ${params.chapter}, verse ${params.verse} in Sanskrit with Hindi and English meaning.`,
      },
    ],
  }),
  component: ShlokPage,
  notFoundComponent: ShlokNotFound,
});

function ShlokPage() {
  const { chapter, verse } = Route.useParams();
  const { isFavorite, toggle } = useFavorites();
  const [copied, setCopied] = useState(false);
  const [query, setQuery] = useState("");
  const navigate = useNavigate();

  const matches = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return [];

    let searchChapter: number | null = null;
    let searchVerse: number | null = null;
    const refMatch = q.match(/(?:ch(?:apter)?\s*)?(\d+)[^\d]+(?:v(?:erse)?\s*)?(\d+)/i);
    if (refMatch) {
      searchChapter = parseInt(refMatch[1], 10);
      searchVerse = parseInt(refMatch[2], 10);
    }

    const filtered = shloks.filter((s) => {
      const ref = `${s.chapter}.${s.verse}`;
      return (
        s.sanskrit.toLowerCase().includes(q) ||
        s.hindi.toLowerCase().includes(q) ||
        s.english.toLowerCase().includes(q) ||
        s.transliteration.toLowerCase().includes(q) ||
        ref.includes(q) ||
        `${s.chapter} ${s.verse}`.includes(q) ||
        (s.chapter === searchChapter && s.verse === searchVerse)
      );
    });

    filtered.sort((a, b) => {
      const aIsExact = a.chapter === searchChapter && a.verse === searchVerse;
      const bIsExact = b.chapter === searchChapter && b.verse === searchVerse;
      if (aIsExact && !bIsExact) return -1;
      if (!aIsExact && bIsExact) return 1;
      return 0;
    });

    return filtered.slice(0, 8);
  }, [query]);

  const onSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const first = matches[0];
    if (!first) return;
    setQuery("");
    navigate({
      to: "/shlok/$chapter/$verse",
      params: { chapter: String(first.chapter), verse: String(first.verse) },
    });
  };

  const index = shloks.findIndex((s) => s.chapter === Number(chapter) && s.verse === Number(verse));
  const shlok = index >= 0 ? shloks[index] : undefined;

  if (!shlok) {
    throw notFound();
  }

  const prev = index > 0 ? shloks[index - 1] : shloks[shloks.length - 1];
  const next = index < shloks.length - 1 ? shloks[index + 1] : shloks[0];
  const fav = isFavorite(shlok.chapter, shlok.verse);

  const onShare = async () => {
    const url = `${window.location.origin}/shlok/${shlok.chapter}/${shlok.verse}`;
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 1600);
    } catch {
      /* ignore */
    }
  };

  return (
    <div className="relative min-h-screen overflow-hidden bg-background text-foreground">
      <header className="relative z-10 mx-auto flex max-w-6xl items-center justify-between px-6 py-8">
        <Link to="/" className="flex items-center gap-3">
          <span className="flex h-10 w-10 items-center justify-center rounded-full border border-primary/40 bg-background/60 text-lg text-primary backdrop-blur devanagari">
            ॐ
          </span>
          <div className="leading-tight">
            <div className="font-display text-xl font-bold tracking-tighter text-primary">
              DAILY <span className="text-foreground">GITA</span>
            </div>
            <div className="text-[11px] uppercase tracking-[0.2em] text-muted-foreground devanagari">
              श्रीमदभगवद्‌गीता यथारूप
            </div>
          </div>
        </Link>
        <nav className="hidden gap-8 text-sm font-semibold uppercase tracking-widest text-muted-foreground md:flex">
          <Link to="/" className="transition-colors hover:text-foreground">
            Today
          </Link>
          <Link to="/favorites" className="transition-colors hover:text-foreground">
            Favorites
          </Link>
        </nav>
      </header>

      <section className="relative z-10 mx-auto max-w-4xl px-6 pb-24 pt-6">
        {/* Search bar */}
        <div className="relative mb-6">
          <form
            onSubmit={onSearchSubmit}
            className="flex items-center overflow-hidden rounded-full border border-border bg-card/40 backdrop-blur transition focus-within:border-primary focus-within:bg-card/70"
          >
            <span className="pl-5 text-lg text-primary" aria-hidden>
              ⌕
            </span>
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="jump to any verse — sanskrit, english, or 2.47"
              aria-label="Search shlokas"
              className="w-full bg-transparent px-3 py-3 text-sm text-foreground placeholder:text-muted-foreground/70 focus:outline-none"
            />
            {query && (
              <button
                type="button"
                onClick={() => setQuery("")}
                aria-label="Clear search"
                className="mr-2 flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-border text-muted-foreground transition hover:border-primary hover:text-primary"
              >
                ✕
              </button>
            )}
            <button
              type="submit"
              disabled={matches.length === 0}
              className="mr-2 shrink-0 rounded-full bg-primary px-4 py-2 text-[10px] font-black uppercase tracking-[0.2em] text-primary-foreground transition hover:opacity-90 disabled:opacity-40"
            >
              open ↗
            </button>
          </form>
          {query && (
            <div className="absolute left-0 right-0 top-full z-30 mt-2 overflow-hidden rounded-2xl border border-border bg-card/95 shadow-xl backdrop-blur">
              {matches.length === 0 ? (
                <div className="px-5 py-4 text-sm text-muted-foreground">
                  no matches for "{query}"
                </div>
              ) : (
                <ul className="max-h-80 overflow-y-auto">
                  {matches.map((m) => (
                    <li key={`${m.chapter}-${m.verse}`}>
                      <Link
                        to="/shlok/$chapter/$verse"
                        params={{ chapter: String(m.chapter), verse: String(m.verse) }}
                        onClick={() => setQuery("")}
                        className="flex items-start gap-3 border-b border-border/50 px-5 py-3 transition last:border-0 hover:bg-secondary/60"
                      >
                        <span className="mt-0.5 shrink-0 rounded-md bg-primary/15 px-2 py-0.5 font-display text-[10px] font-black tracking-widest text-primary">
                          {m.chapter}.{m.verse}
                        </span>
                        <div className="min-w-0 flex-1">
                          <p className="devanagari line-clamp-1 text-sm text-foreground">
                            {m.sanskrit.split("\n")[0]}
                          </p>
                          <p className="line-clamp-1 text-xs italic text-muted-foreground">
                            "{m.english}"
                          </p>
                        </div>
                      </Link>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          )}
        </div>

        <div className="mb-6 flex items-center gap-2 text-sm text-muted-foreground">
          <Link to="/" className="transition-colors hover:text-foreground">
            ← Home
          </Link>
          <span>/</span>
          <span>Chapter {shlok.chapter}</span>
          <span>/</span>
          <span className="text-primary">Verse {shlok.verse}</span>
        </div>

        <article className="relative overflow-hidden rounded-3xl border border-border bg-card/40 px-8 py-12 backdrop-blur-md md:px-14 md:py-14">
          {/* Subtle golden mandala rings */}
          <div className="pointer-events-none absolute -right-20 -top-20 h-80 w-80 rounded-full border border-primary/5" />
          <div className="pointer-events-none absolute -right-10 -top-10 h-60 w-60 rounded-full border border-primary/10" />
          <div className="pointer-events-none absolute left-1/2 top-[14%] h-[22rem] w-[22rem] -translate-x-1/2 rounded-full verse-glow md:h-[28rem] md:w-[28rem]" />

          <div className="relative z-10">
            <div className="mb-8 flex flex-col items-center gap-4 sm:flex-row sm:justify-between">
              <div className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-secondary/60 px-4 py-1.5 text-xs uppercase tracking-[0.2em] text-primary backdrop-blur">
                <span className="h-1.5 w-1.5 rounded-full bg-primary" />
                Bhagavad Gītā · {shlok.chapter}.{shlok.verse}
              </div>
              <div className="flex items-center gap-2">
                <VoicePlayer hindi={shlok.hindi} english={shlok.english} />
                <button
                  onClick={onShare}
                  aria-label="Copy link to this verse"
                  className="inline-flex items-center gap-1.5 rounded-full border border-primary/40 bg-card/70 px-3 py-1.5 text-xs font-semibold uppercase tracking-wider text-primary transition hover:bg-primary hover:text-primary-foreground"
                >
                  <span aria-hidden>↗</span>
                  {copied ? "Copied!" : "Share"}
                </button>
                <button
                  onClick={() => toggle(shlok.chapter, shlok.verse)}
                  aria-label={fav ? "Remove from favorites" : "Save to favorites"}
                  aria-pressed={fav}
                  className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-semibold uppercase tracking-wider transition ${
                    fav
                      ? "border-crimson bg-crimson text-white"
                      : "border-crimson/40 bg-card/70 text-crimson hover:bg-crimson hover:text-white"
                  }`}
                >
                  <span aria-hidden>{fav ? "♥" : "♡"}</span>
                  {fav ? "Saved" : "Save"}
                </button>
              </div>
            </div>

            <div className="mb-6 flex items-center justify-center gap-3">
              <span className="h-px w-12 bg-gradient-to-r from-transparent to-gold" />
              <span className="devanagari text-2xl text-primary">॥ श्लोक ॥</span>
              <span className="h-px w-12 bg-gradient-to-l from-transparent to-gold" />
            </div>

            <h1 className="devanagari whitespace-pre-line text-center text-2xl leading-relaxed text-foreground md:text-4xl">
              {shlok.sanskrit}
            </h1>

            <p className="mx-auto mt-6 max-w-2xl whitespace-pre-line text-center font-display text-base italic text-muted-foreground md:text-lg">
              {shlok.transliteration}
            </p>

            <div className="my-10 flex items-center justify-center gap-4">
              <span className="h-px w-16 bg-border" />
              <span className="text-[10px] uppercase tracking-[0.3em] text-muted-foreground">
                meaning
              </span>
              <span className="h-px w-16 bg-border" />
            </div>

            <div className="grid gap-10 text-left md:grid-cols-2">
              <div>
                <div className="mb-3 flex items-center gap-2">
                  <span className="devanagari text-xl text-primary">हिन्दी</span>
                  <span className="h-px flex-1 bg-border" />
                </div>
                <p className="devanagari text-base leading-relaxed text-foreground/90 md:text-lg">
                  {shlok.hindi}
                </p>
              </div>
              <div>
                <div className="mb-3 flex items-center gap-2">
                  <span className="font-display text-xl italic text-primary">English</span>
                  <span className="h-px flex-1 bg-border" />
                </div>
                <p className="font-display text-base leading-relaxed text-foreground/90 md:text-lg">
                  {shlok.english}
                </p>
              </div>
            </div>
          </div>
        </article>

        {/* Prev / Next navigation */}
        <nav className="mt-8 grid gap-3 md:grid-cols-2">
          <Link
            to="/shlok/$chapter/$verse"
            params={{ chapter: String(prev.chapter), verse: String(prev.verse) }}
            className="group rounded-2xl border border-border bg-card/30 p-5 transition hover:-translate-y-0.5 hover:border-primary/50 hover:bg-card/60"
          >
            <div className="text-[10px] font-black uppercase tracking-[0.25em] text-muted-foreground">
              ← previous
            </div>
            <div className="mt-1 font-display text-sm text-primary">
              Chapter {prev.chapter}, Verse {prev.verse}
            </div>
            <p className="mt-2 line-clamp-2 devanagari text-sm text-foreground/80">
              {prev.sanskrit.split("\n")[0]}
            </p>
          </Link>
          <Link
            to="/shlok/$chapter/$verse"
            params={{ chapter: String(next.chapter), verse: String(next.verse) }}
            className="group rounded-2xl border border-border bg-card/30 p-5 text-right transition hover:-translate-y-0.5 hover:border-primary/50 hover:bg-card/60"
          >
            <div className="text-[10px] font-black uppercase tracking-[0.25em] text-muted-foreground">
              next →
            </div>
            <div className="mt-1 font-display text-sm text-primary">
              Chapter {next.chapter}, Verse {next.verse}
            </div>
            <p className="mt-2 line-clamp-2 devanagari text-sm text-foreground/80">
              {next.sanskrit.split("\n")[0]}
            </p>
          </Link>
        </nav>
      </section>
    </div>
  );
}

function ShlokNotFound() {
  return (
    <div className="relative min-h-screen overflow-hidden bg-background text-foreground">
      <header className="relative z-10 mx-auto flex max-w-6xl items-center justify-between px-6 py-8">
        <Link to="/" className="flex items-center gap-3">
          <span className="flex h-10 w-10 items-center justify-center rounded-full border border-primary/40 bg-card/60 text-lg text-primary backdrop-blur devanagari">
            ॐ
          </span>
          <div className="leading-tight">
            <div className="font-display text-xl font-bold tracking-tighter text-primary">
              DAILY <span className="text-foreground">GITA</span>
            </div>
          </div>
        </Link>
      </header>
      <section className="relative z-10 mx-auto max-w-3xl px-6 pb-24 pt-12 text-center">
        <h1 className="font-display text-4xl text-foreground md:text-5xl">Verse not found</h1>
        <p className="mt-4 text-muted-foreground">
          That chapter and verse aren't in our collection yet.
        </p>
        <Link
          to="/"
          className="mt-8 inline-flex items-center justify-center rounded-md bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground hover:bg-primary/90"
        >
          Return home
        </Link>
      </section>
    </div>
  );
}
