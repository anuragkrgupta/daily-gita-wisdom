import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useState } from "react";
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

  const index = shloks.findIndex(
    (s) => s.chapter === Number(chapter) && s.verse === Number(verse),
  );
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
          <Link to="/" className="transition-colors hover:text-foreground">Today</Link>
          <Link to="/favorites" className="transition-colors hover:text-foreground">Favorites</Link>
        </nav>
      </header>

      <section className="relative z-10 mx-auto max-w-4xl px-6 pb-24 pt-6">
        <div className="mb-6 flex items-center gap-2 text-sm text-muted-foreground">
          <Link to="/" className="transition-colors hover:text-foreground">← Home</Link>
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
            <div className="mb-8 flex flex-wrap items-center justify-between gap-3">
              <div className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-secondary/60 px-4 py-1.5 text-xs uppercase tracking-[0.2em] text-primary backdrop-blur">
                <span className="h-1.5 w-1.5 rounded-full bg-primary" />
                Bhagavad Gītā · {shlok.chapter}.{shlok.verse}
              </div>
              <div className="flex items-center gap-2">
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
              <span className="text-[10px] uppercase tracking-[0.3em] text-muted-foreground">meaning</span>
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
            <div className="text-[10px] font-black uppercase tracking-[0.25em] text-muted-foreground">← previous</div>
            <div className="mt-1 font-display text-sm text-primary">Chapter {prev.chapter}, Verse {prev.verse}</div>
            <p className="mt-2 line-clamp-2 devanagari text-sm text-foreground/80">{prev.sanskrit.split("\n")[0]}</p>
          </Link>
          <Link
            to="/shlok/$chapter/$verse"
            params={{ chapter: String(next.chapter), verse: String(next.verse) }}
            className="group rounded-2xl border border-border bg-card/30 p-5 text-right transition hover:-translate-y-0.5 hover:border-primary/50 hover:bg-card/60"
          >
            <div className="text-[10px] font-black uppercase tracking-[0.25em] text-muted-foreground">next →</div>
            <div className="mt-1 font-display text-sm text-primary">Chapter {next.chapter}, Verse {next.verse}</div>
            <p className="mt-2 line-clamp-2 devanagari text-sm text-foreground/80">{next.sanskrit.split("\n")[0]}</p>
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
