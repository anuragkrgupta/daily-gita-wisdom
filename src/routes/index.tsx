import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import heroAsset from "@/assets/hero-chakra.png.asset.json";
import { shloks, getDailyShlok, formatDate, type Shlok } from "@/lib/shloks";
import { useFavorites } from "@/lib/favorites";

export const Route = createFileRoute("/")({
  component: Index,
});

function Index() {
  const today = useMemo(() => new Date(), []);
  const daily = useMemo(() => getDailyShlok(today), [today]);
  const [selected, setSelected] = useState<Shlok>(daily);
  const { isFavorite, toggle, ids } = useFavorites();
  const selectedFav = isFavorite(selected.chapter, selected.verse);

  return (
    <div className="relative min-h-screen overflow-hidden bg-background text-foreground">
      {/* Hero Section */}
      <section className="relative flex h-[90vh] min-h-[600px] flex-col">
        {/* Hero image */}
        <div className="absolute inset-0 z-0">
          <img
            src={heroAsset.url}
            alt="Arjuna's chariot on the battlefield beneath the glowing Sudarshan Chakra"
            className="h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-black/40" />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/30 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-r from-background/80 via-transparent to-transparent" />
        </div>

        {/* Header overlay */}
        <header className="relative z-20 mx-auto flex w-full max-w-6xl items-center justify-between px-6 py-8">
          <Link to="/" className="flex items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-full border border-primary/40 bg-background/60 text-lg text-primary backdrop-blur devanagari">
              ॐ
            </span>
            <div className="leading-tight">
              <div className="font-display text-xl font-bold tracking-tighter text-primary">
                DAILY <span className="text-foreground">GITA</span>
              </div>
              <div className="text-[11px] uppercase tracking-[0.2em] text-muted-foreground">
                श्रीमद्भगवद्गीता
              </div>
            </div>
          </Link>
          <nav className="hidden gap-8 text-sm font-semibold uppercase tracking-widest text-muted-foreground md:flex">
            <a href="#today" className="text-primary transition-colors hover:text-foreground">Today</a>
            <a href="#archive" className="transition-colors hover:text-foreground">Archive</a>
            <Link to="/favorites" className="transition-colors hover:text-foreground">
              Favorites{ids.length > 0 ? ` (${ids.length})` : ""}
            </Link>
            <a href="#about" className="transition-colors hover:text-foreground">About</a>
          </nav>
        </header>

        {/* Tagline — bottom-left of the image */}
        <div className="relative z-20 mx-auto mt-auto w-full max-w-6xl px-6 pb-16 md:pb-20">
          <div className="max-w-3xl">
            <p className="font-display text-2xl font-semibold leading-[1.15] text-white drop-shadow-2xl md:text-4xl lg:text-5xl">
              A single shlok from the Bhagavad Gita each morning —{" "}
              <span className="bg-gradient-to-r from-gold to-primary bg-clip-text text-transparent">
                in original Sanskrit
              </span>
              , with faithful Hindi and English meaning.
            </p>
            <div className="mt-6 flex flex-wrap items-center gap-4 text-xs font-bold uppercase tracking-[0.25em] text-primary">
              <span>Read</span>
              <span className="h-1.5 w-1.5 rounded-full bg-primary/60" />
              <span>Reflect</span>
              <span className="h-1.5 w-1.5 rounded-full bg-primary/60" />
              <span>Return tomorrow</span>
            </div>
          </div>
        </div>
      </section>

      {/* Verse of the Day */}
      <section id="today" className="relative z-10 mx-auto max-w-6xl px-6 py-24">
        <div className="relative">
          <div className="absolute -top-24 left-1/2 h-24 w-px -translate-x-1/2 bg-gradient-to-b from-transparent to-primary/50" />

          <article className="relative overflow-hidden rounded-3xl border border-border bg-card/40 px-8 py-12 backdrop-blur-md md:px-16 md:py-16">
            {/* Subtle golden mandala rings */}
            <div className="pointer-events-none absolute -right-20 -top-20 h-80 w-80 rounded-full border border-primary/5" />
            <div className="pointer-events-none absolute -right-10 -top-10 h-60 w-60 rounded-full border border-primary/10" />

            <div className="relative z-10">
              <div className="mb-8 flex items-center justify-between">
                <div className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-secondary/60 px-4 py-1.5 text-xs uppercase tracking-[0.2em] text-primary backdrop-blur">
                  <span className="h-1.5 w-1.5 rounded-full bg-primary" />
                  Verse of the Day · {formatDate(today)}
                </div>
                <button
                  onClick={() => toggle(selected.chapter, selected.verse)}
                  aria-label={selectedFav ? "Remove from favorites" : "Save to favorites"}
                  aria-pressed={selectedFav}
                  className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-semibold uppercase tracking-wider transition ${
                    selectedFav
                      ? "border-crimson bg-crimson text-white"
                      : "border-crimson/40 bg-card/70 text-crimson hover:bg-crimson hover:text-white"
                  }`}
                >
                  <span aria-hidden>{selectedFav ? "♥" : "♡"}</span>
                  {selectedFav ? "Saved" : "Save"}
                </button>
              </div>

              <div className="flex items-center justify-center gap-3">
                <span className="h-px w-12 bg-gradient-to-r from-transparent to-gold" />
                <span className="devanagari text-2xl text-primary">॥ श्लोक ॥</span>
                <span className="h-px w-12 bg-gradient-to-l from-transparent to-gold" />
              </div>

              {/* Radial gold glow behind the verse */}
              <div className="pointer-events-none absolute left-1/2 top-[16%] h-[22rem] w-[22rem] -translate-x-1/2 rounded-full verse-glow md:h-[28rem] md:w-[28rem]" />

              <p className="relative mx-auto mt-8 max-w-3xl text-center devanagari whitespace-pre-line text-2xl leading-relaxed text-foreground md:text-4xl">
                {selected.sanskrit}
              </p>

              <p className="relative mx-auto mt-6 max-w-2xl text-center whitespace-pre-line font-display text-base italic text-muted-foreground md:text-lg">
                {selected.transliteration}
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
                    {selected.hindi}
                  </p>
                </div>
                <div>
                  <div className="mb-3 flex items-center gap-2">
                    <span className="font-display text-xl italic text-primary">English</span>
                    <span className="h-px flex-1 bg-border" />
                  </div>
                  <p className="font-display text-base leading-relaxed text-foreground/90 md:text-lg">
                    {selected.english}
                  </p>
                </div>
              </div>
            </div>
          </article>
        </div>
      </section>

      {/* Archive */}
      <section id="archive" className="relative z-10 bg-secondary/40 py-24">
        <div className="mx-auto max-w-6xl px-6">
          <div className="mb-12 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div>
              <div className="text-xs uppercase tracking-[0.25em] text-primary">Archive</div>
              <h2 className="font-display text-4xl font-bold text-foreground md:text-5xl">
                Wander the verses
              </h2>
              <p className="mt-2 text-sm text-muted-foreground">Tap any shlok to read it above.</p>
            </div>
            <Link
              to="/favorites"
              className="w-fit rounded-md border border-primary/30 bg-card/60 px-5 py-2.5 text-xs font-bold uppercase tracking-widest text-primary transition hover:bg-primary hover:text-primary-foreground"
            >
              View favorites →
            </Link>
          </div>

          <div className="grid gap-1 sm:grid-cols-2 lg:grid-cols-3">
            {shloks.map((s) => {
              const isActive = s.chapter === selected.chapter && s.verse === selected.verse;
              const fav = isFavorite(s.chapter, s.verse);
              return (
                <div
                  key={`${s.chapter}-${s.verse}`}
                  className={`group relative overflow-hidden border p-8 text-left transition-all duration-300 hover:bg-card/60 ${
                    isActive
                      ? "border-primary bg-card/80 shadow-xl"
                      : "border-border bg-card/30 hover:border-primary/40"
                  }`}
                >
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      toggle(s.chapter, s.verse);
                    }}
                    aria-label={fav ? "Remove from favorites" : "Save to favorites"}
                    aria-pressed={fav}
                    className={`absolute right-4 top-4 z-10 flex h-8 w-8 items-center justify-center rounded-full border text-sm transition ${
                      fav
                        ? "border-crimson bg-crimson text-white"
                        : "border-border bg-card/80 text-crimson hover:border-crimson"
                    }`}
                  >
                    {fav ? "♥" : "♡"}
                  </button>
                  <button
                    onClick={() => {
                      setSelected(s);
                      document.getElementById("today")?.scrollIntoView({ behavior: "smooth" });
                    }}
                    className="block w-full text-left"
                  >
                    <div className="mb-4 flex items-center justify-between">
                      <span className="text-[10px] uppercase tracking-[0.25em] text-muted-foreground">
                        Chapter {s.chapter}
                      </span>
                      <span className="mr-10 font-display text-2xl italic text-primary">
                        {s.verse}
                      </span>
                    </div>
                    <p className="devanagari line-clamp-3 text-lg leading-snug text-foreground">
                      {s.sanskrit.split("\n")[0]}
                    </p>
                    <p className="mt-3 line-clamp-2 text-sm italic text-muted-foreground">
                      "{s.english}"
                    </p>
                    <div className="mt-5 flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-primary opacity-0 transition-opacity group-hover:opacity-100">
                      Read shlok <span>→</span>
                    </div>
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* About */}
      <section id="about" className="relative z-10 border-t border-border/50">
        <div className="mx-auto grid max-w-6xl gap-10 px-6 py-16 md:grid-cols-3">
          <div>
            <div className="text-xs uppercase tracking-[0.25em] text-primary">About</div>
            <h3 className="mt-2 font-display text-3xl text-foreground">
              The song of the divine
            </h3>
          </div>
          <p className="md:col-span-2 text-base leading-relaxed text-muted-foreground">
            The Bhagavad Gītā — literally "the Song of God" — is a 700-verse dialogue between Prince Arjuna and Lord Krishna on the battlefield of Kurukshetra. For over two millennia it has served as a compass for seekers navigating duty, doubt, love, and liberation. This site returns one verse to your day, in the original Sanskrit and in words you can carry with you.
          </p>
        </div>
        <footer className="border-t border-border/50 py-8 text-center">
          <p className="text-[11px] font-bold uppercase tracking-[0.35em] text-muted-foreground">
            <span className="devanagari not-italic">॥ ॐ तत् सत् ॥</span>
          </p>
        </footer>
      </section>
    </div>
  );
}
