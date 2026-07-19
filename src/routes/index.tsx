import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import heroAsset from "@/assets/hero-chakra.png.asset.json";
import { shloks, getDailyShlok, formatDate } from "@/lib/shloks";
import { useFavorites } from "@/lib/favorites";

export const Route = createFileRoute("/")({
  component: Index,
});

function Index() {
  const today = useMemo(() => new Date(), []);
  const daily = useMemo(() => getDailyShlok(today), [today]);
  const selected = daily;
  const { isFavorite, toggle, ids } = useFavorites();
  const selectedFav = isFavorite(selected.chapter, selected.verse);
  const [query, setQuery] = useState("");
  const navigate = useNavigate();

  const filteredShloks = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return shloks;
    return shloks.filter((s) => {
      const ref = `${s.chapter}.${s.verse}`;
      const refSpaced = `${s.chapter} ${s.verse}`;
      return (
        s.sanskrit.toLowerCase().includes(q) ||
        s.hindi.toLowerCase().includes(q) ||
        s.english.toLowerCase().includes(q) ||
        s.transliteration.toLowerCase().includes(q) ||
        ref.includes(q) ||
        refSpaced.includes(q)
      );
    });
  }, [query]);

  const onSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const first = filteredShloks[0];
    if (!first) return;
    navigate({
      to: "/shlok/$chapter/$verse",
      params: { chapter: String(first.chapter), verse: String(first.verse) },
    });
  };

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
              <div className="text-[11px] uppercase tracking-[0.2em] text-muted-foreground devanagari">
                श्रीमदभगवद्‌गीता यथारूप
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
            <p className="devanagari text-lg font-semibold leading-relaxed text-white drop-shadow-2xl md:text-xl lg:text-2xl">
              कृष्णकृपामूर्ति श्री श्रीमद् ए. सी. भक्तिवेदान्त स्वामी प्रभुपाद संस्थापकाचार्य: अन्तर्राष्ट्रीय कृष्णभावनामृत संघ&nbsp;
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
        {/* Marquee ticker */}
        <div className="mb-16 overflow-hidden border-y border-border/60 bg-card/30 py-3">
          <div className="flex w-max marquee-track gap-10 whitespace-nowrap text-xs font-bold uppercase tracking-[0.3em] text-primary/80">
            {Array.from({ length: 2 }).map((_, i) => (
              <div key={i} className="flex items-center gap-10">
                <span>✦ Daily dose of dharma</span>
                <span className="text-muted-foreground">no chill, just chakra</span>
                <span>✦ 700 verses. 1 vibe.</span>
                <span className="text-muted-foreground">read · reflect · repost</span>
                <span>✦ Gita-coded</span>
                <span className="text-muted-foreground">since 3102 BCE</span>
                <span>✦ krishna said what?</span>
                <span className="text-muted-foreground">find out below ↓</span>
              </div>
            ))}
          </div>
        </div>

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
              <div className="inline-flex items-center gap-2 rounded-full sticker px-3 py-1 text-[10px] uppercase tracking-[0.25em]">
                <span className="h-1.5 w-1.5 rounded-full bg-primary" />
                the shlok drop
              </div>
              <h2 className="mt-3 font-display text-4xl font-black text-foreground md:text-6xl">
                pick a verse.<br />
                <span className="italic text-primary">catch a vibe.</span>
              </h2>
              <p className="mt-2 text-sm text-muted-foreground">Tap any tile. It jumps up top. That easy.</p>
            </div>
            <Link
              to="/favorites"
              className="w-fit rounded-full border border-primary/40 bg-card/60 px-5 py-2.5 text-xs font-bold uppercase tracking-widest text-primary transition hover:bg-primary hover:text-primary-foreground"
            >
              your saved ♥ →
            </Link>
          </div>

          {/* Search bar */}
          <div className="mb-8">
            <form
              onSubmit={onSearchSubmit}
              className="flex items-center overflow-hidden rounded-full border border-border bg-card/40 backdrop-blur transition focus-within:border-primary focus-within:bg-card/70"
            >
              <span className="pl-5 text-lg text-primary" aria-hidden>⌕</span>
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="search sanskrit, hindi, english, or 2.47 — press enter"
                aria-label="Search shlokas"
                className="w-full bg-transparent px-3 py-3.5 text-sm text-foreground placeholder:text-muted-foreground/70 focus:outline-none md:text-base"
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
              <div className="mr-3 hidden shrink-0 text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground md:block">
                {filteredShloks.length}/{shloks.length}
              </div>
              <button
                type="submit"
                disabled={filteredShloks.length === 0}
                className="mr-2 shrink-0 rounded-full bg-primary px-4 py-2 text-[10px] font-black uppercase tracking-[0.2em] text-primary-foreground transition hover:opacity-90 disabled:opacity-40"
              >
                open ↗
              </button>
            </form>
            {query && filteredShloks[0] && (
              <p className="mt-2 pl-5 text-[11px] uppercase tracking-[0.2em] text-muted-foreground">
                enter opens{" "}
                <span className="text-primary">
                  {filteredShloks[0].chapter}.{filteredShloks[0].verse}
                </span>
              </p>
            )}
          </div>

          {/* Bento grid — max 7 tiles, packed tight */}
          <div className="grid auto-rows-[minmax(180px,auto)] grid-flow-row-dense grid-cols-2 gap-3 md:grid-cols-4 md:gap-4">
            {filteredShloks.slice(0, 7).map((s, idx) => {
              const isActive = s.chapter === selected.chapter && s.verse === selected.verse;
              const fav = isFavorite(s.chapter, s.verse);
              // Bento sizing pattern — totals 16 cells (4×4) so no gaps
              const sizes = [
                "col-span-2 row-span-2",
                "col-span-2 row-span-1",
                "col-span-2 row-span-1",
                "col-span-2 row-span-1",
                "col-span-2 row-span-1",
                "col-span-1 row-span-1",
                "col-span-1 row-span-1",
              ];
              const size = sizes[idx % sizes.length];
              const isLarge = size.includes("col-span-2") && size.includes("row-span-2");
              return (
                <div
                  key={`${s.chapter}-${s.verse}`}
                  className={`group relative overflow-hidden rounded-3xl border p-5 text-left transition-all duration-300 hover:-translate-y-1 hover:bg-card/70 md:p-7 ${size} ${
                    isActive
                      ? "border-primary bg-card/80 shadow-[0_0_40px_-10px_var(--primary)]"
                      : "border-border bg-card/30 hover:border-primary/50"
                  }`}
                >
                  {/* Corner sticker with chapter.verse */}
                  <div className="absolute -left-2 -top-2 rotate-[-8deg] sticker rounded-lg px-2 py-0.5 font-display text-[10px] font-black tracking-widest">
                    {s.chapter}.{s.verse}
                  </div>
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
                  <Link
                    to="/shlok/$chapter/$verse"
                    params={{ chapter: String(s.chapter), verse: String(s.verse) }}
                    className="flex h-full w-full flex-col justify-end text-left"
                  >
                    <p className={`devanagari ${isLarge ? "line-clamp-5 text-2xl md:text-3xl" : "line-clamp-3 text-base md:text-lg"} leading-snug text-foreground`}>
                      {s.sanskrit.split("\n")[0]}
                    </p>
                    <p className={`mt-3 ${isLarge ? "line-clamp-3 text-base" : "line-clamp-2 text-xs"} italic text-muted-foreground`}>
                      "{s.english}"
                    </p>
                    <div className="mt-4 flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-primary opacity-0 transition-opacity group-hover:opacity-100">
                      read full page <span>↗</span>
                    </div>
                  </Link>
                </div>
              );
            })}
            {filteredShloks.length === 0 ? (
              <div className="col-span-2 flex flex-col items-center justify-center gap-2 rounded-3xl border border-dashed border-border bg-card/20 p-8 text-center md:col-span-4">
                <div className="devanagari text-4xl text-primary/60">∅</div>
                <p className="font-display text-lg text-foreground">no shloks match "{query}"</p>
                <button
                  onClick={() => setQuery("")}
                  className="text-[10px] font-black uppercase tracking-[0.25em] text-primary hover:text-foreground"
                >
                  clear search ↺
                </button>
              </div>
            ) : (
              <div className="col-span-2 row-span-1 flex items-center justify-between overflow-hidden rounded-3xl border border-primary/30 bg-gradient-to-br from-primary/20 via-card/60 to-crimson/10 p-6 md:p-8">
                <div>
                  <div className="text-[10px] font-black uppercase tracking-[0.3em] text-primary">daily reset</div>
                  <p className="mt-2 font-display text-2xl font-black leading-tight md:text-3xl">
                    come back tmrw for<br />a new one ✦
                  </p>
                </div>
                <div className="devanagari text-6xl text-primary/70 md:text-8xl">ॐ</div>
              </div>
            )}
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
