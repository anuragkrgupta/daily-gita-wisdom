import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import krishnaImg from "@/assets/krishna-arjuna.jpg";
import mandalaImg from "@/assets/mandala.png";
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
    <div className="relative min-h-screen overflow-hidden">
      {/* Ambient mandala backdrop */}
      <img
        src={mandalaImg}
        alt=""
        aria-hidden
        className="pointer-events-none absolute -right-40 -top-40 h-[36rem] w-[36rem] opacity-[0.08] rotate-slow"
        style={{ animation: "spin 120s linear infinite" }}
      />
      <img
        src={mandalaImg}
        alt=""
        aria-hidden
        className="pointer-events-none absolute -bottom-60 -left-40 h-[32rem] w-[32rem] opacity-[0.06]"
        style={{ animation: "spin 180s linear infinite reverse" }}
      />

      {/* Nav */}
      <header className="relative z-10 mx-auto flex max-w-6xl items-center justify-between px-6 py-8">
        <div className="flex items-center gap-3">
          <span className="flex h-10 w-10 items-center justify-center rounded-full bg-primary text-lg text-primary-foreground devanagari">
            ॐ
          </span>
          <div className="leading-tight">
            <div className="font-display text-xl font-semibold tracking-tight text-primary">
              Daily Gita
            </div>
            <div className="text-[11px] uppercase tracking-[0.2em] text-muted-foreground">
              श्रीमद्भगवद्गीता
            </div>
          </div>
        </div>
        <nav className="hidden gap-8 text-sm text-muted-foreground md:flex">
          <a href="#today" className="hover:text-primary transition-colors">Today</a>
          <a href="#archive" className="hover:text-primary transition-colors">Archive</a>
          <Link to="/favorites" className="hover:text-primary transition-colors">
            Favorites{ids.length > 0 ? ` (${ids.length})` : ""}
          </Link>
          <a href="#about" className="hover:text-primary transition-colors">About</a>
        </nav>
      </header>

      {/* Hero */}
      <section id="today" className="relative z-10 mx-auto max-w-6xl px-6 pb-16 pt-6">
        <div className="grid gap-10 lg:grid-cols-[1.15fr_1fr] lg:items-center">
          <div>
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-accent/40 bg-card/60 px-4 py-1.5 text-xs uppercase tracking-[0.25em] text-primary backdrop-blur">
              <span className="h-1.5 w-1.5 rounded-full bg-saffron" />
              Verse of the Day · {formatDate(today)}
            </div>
            <h1 className="font-display text-5xl leading-[1.05] text-primary md:text-6xl lg:text-7xl">
              Timeless wisdom,
              <br />
              <span className="italic text-crimson">delivered daily.</span>
            </h1>
            <p className="mt-6 max-w-xl text-lg leading-relaxed text-muted-foreground">
              A single shlok from the Bhagavad Gita each morning — in original Sanskrit, with faithful Hindi and English meaning. Read. Reflect. Return tomorrow.
            </p>
            <div className="mt-8 flex flex-wrap gap-4 text-sm">
              <div className="rounded-lg border border-border bg-card/70 px-4 py-3 backdrop-blur">
                <div className="text-xs uppercase tracking-wider text-muted-foreground">Chapter</div>
                <div className="font-display text-2xl text-primary">{selected.chapter}</div>
              </div>
              <div className="rounded-lg border border-border bg-card/70 px-4 py-3 backdrop-blur">
                <div className="text-xs uppercase tracking-wider text-muted-foreground">Verse</div>
                <div className="font-display text-2xl text-primary">{selected.verse}</div>
              </div>
              <div className="rounded-lg border border-border bg-card/70 px-4 py-3 backdrop-blur">
                <div className="text-xs uppercase tracking-wider text-muted-foreground">Collection</div>
                <div className="font-display text-2xl text-primary">{shloks.length} shloks</div>
              </div>
            </div>
          </div>

          <div className="relative">
            <div className="gold-frame overflow-hidden rounded-2xl">
              <img
                src={krishnaImg}
                alt="Krishna and Arjuna on the battlefield of Kurukshetra"
                width={1600}
                height={1200}
                className="h-full w-full object-cover"
              />
            </div>
            <div className="absolute -bottom-5 -left-5 hidden rounded-xl border border-accent/60 bg-parchment/95 px-5 py-3 shadow-xl backdrop-blur md:block">
              <div className="text-[10px] uppercase tracking-[0.25em] text-muted-foreground">
                From Chapter {selected.chapter}
              </div>
              <div className="font-display text-lg italic text-crimson">
                "{selected.english.split(",")[0]}…"
              </div>
            </div>
          </div>
        </div>

        {/* Featured shlok card */}
        <article className="paper gold-frame relative mt-16 overflow-hidden rounded-3xl px-8 py-12 md:px-16 md:py-16">
          <div className="absolute right-6 top-6 flex items-center gap-3">
            <span className="font-display text-sm italic text-muted-foreground">
              Bhagavad Gītā · {selected.chapter}.{selected.verse}
            </span>
            <button
              onClick={() => toggle(selected.chapter, selected.verse)}
              aria-label={selectedFav ? "Remove from favorites" : "Save to favorites"}
              aria-pressed={selectedFav}
              className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-medium transition ${
                selectedFav
                  ? "border-crimson bg-crimson text-white"
                  : "border-crimson/40 bg-card/70 text-crimson hover:bg-crimson hover:text-white"
              }`}
            >
              <span aria-hidden>{selectedFav ? "♥" : "♡"}</span>
              {selectedFav ? "Saved" : "Save"}
            </button>
          </div>

          <div className="mx-auto max-w-3xl text-center">
            <div className="mb-6 flex items-center justify-center gap-3">
              <span className="h-px w-12 bg-gradient-to-r from-transparent to-gold" />
              <span className="devanagari text-2xl text-saffron">॥ श्लोक ॥</span>
              <span className="h-px w-12 bg-gradient-to-l from-transparent to-gold" />
            </div>

            <p className="devanagari whitespace-pre-line text-2xl leading-relaxed text-primary md:text-3xl">
              {selected.sanskrit}
            </p>

            <p className="mt-6 whitespace-pre-line font-display text-base italic text-muted-foreground md:text-lg">
              {selected.transliteration}
            </p>

            <div className="my-10 flex items-center justify-center gap-4">
              <span className="h-px w-16 bg-border" />
              <span className="text-[10px] uppercase tracking-[0.3em] text-muted-foreground">meaning</span>
              <span className="h-px w-16 bg-border" />
            </div>

            <div className="grid gap-8 text-left md:grid-cols-2">
              <div>
                <div className="mb-3 flex items-center gap-2">
                  <span className="devanagari text-xl text-crimson">हिन्दी</span>
                  <span className="h-px flex-1 bg-border" />
                </div>
                <p className="devanagari text-base leading-relaxed text-foreground md:text-lg">
                  {selected.hindi}
                </p>
              </div>
              <div>
                <div className="mb-3 flex items-center gap-2">
                  <span className="font-display text-xl italic text-crimson">English</span>
                  <span className="h-px flex-1 bg-border" />
                </div>
                <p className="font-display text-base leading-relaxed text-foreground md:text-lg">
                  {selected.english}
                </p>
              </div>
            </div>
          </div>
        </article>
      </section>

      {/* Archive */}
      <section id="archive" className="relative z-10 mx-auto max-w-6xl px-6 pb-24">
        <div className="mb-10 flex items-end justify-between">
          <div>
            <div className="text-xs uppercase tracking-[0.25em] text-saffron">Archive</div>
            <h2 className="font-display text-4xl text-primary md:text-5xl">
              Wander the verses
            </h2>
          </div>
          <div className="hidden text-sm text-muted-foreground md:block">
            Tap any shlok to read it above ↑
          </div>
        </div>

        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {shloks.map((s) => {
            const isActive = s.chapter === selected.chapter && s.verse === selected.verse;
            const fav = isFavorite(s.chapter, s.verse);
            return (
              <div
                key={`${s.chapter}-${s.verse}`}
                className={`group relative overflow-hidden rounded-2xl border p-6 text-left transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl ${
                  isActive
                    ? "border-saffron bg-card shadow-xl"
                    : "border-border bg-card/50 hover:border-accent"
                }`}
              >
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    toggle(s.chapter, s.verse);
                  }}
                  aria-label={fav ? "Remove from favorites" : "Save to favorites"}
                  aria-pressed={fav}
                  className={`absolute right-3 top-3 z-10 flex h-8 w-8 items-center justify-center rounded-full border text-sm transition ${
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
                <div className="mb-3 flex items-center justify-between">
                  <span className="text-[10px] uppercase tracking-[0.25em] text-muted-foreground">
                    Chapter {s.chapter}
                  </span>
                  <span className="mr-10 font-display text-2xl italic text-saffron">
                    {s.verse}
                  </span>
                </div>
                <p className="devanagari line-clamp-3 text-lg leading-snug text-primary">
                  {s.sanskrit.split("\n")[0]}
                </p>
                <p className="mt-3 line-clamp-2 text-sm italic text-muted-foreground">
                  "{s.english}"
                </p>
                <div className="mt-4 flex items-center gap-2 text-xs font-medium uppercase tracking-wider text-crimson opacity-0 transition-opacity group-hover:opacity-100">
                  Read shlok <span>→</span>
                </div>
                </button>
              </div>
            );
          })}
        </div>
      </section>

      {/* About */}
      <section id="about" className="relative z-10 border-t border-border/50 bg-card/40 backdrop-blur">
        <div className="mx-auto grid max-w-6xl gap-10 px-6 py-16 md:grid-cols-3">
          <div>
            <div className="text-xs uppercase tracking-[0.25em] text-saffron">About</div>
            <h3 className="mt-2 font-display text-3xl text-primary">
              The song of the divine
            </h3>
          </div>
          <p className="md:col-span-2 text-base leading-relaxed text-muted-foreground">
            The Bhagavad Gītā — literally "the Song of God" — is a 700-verse dialogue between Prince Arjuna and Lord Krishna on the battlefield of Kurukshetra. For over two millennia it has served as a compass for seekers navigating duty, doubt, love, and liberation. This site returns one verse to your day, in the original Sanskrit and in words you can carry with you.
          </p>
        </div>
        <footer className="border-t border-border/50 py-6 text-center text-xs uppercase tracking-[0.3em] text-muted-foreground">
          <span className="devanagari not-italic">॥ ॐ तत् सत् ॥</span>
        </footer>
      </section>
    </div>
  );
}
