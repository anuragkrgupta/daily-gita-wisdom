import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { shloks } from "@/lib/shloks";

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
  const shlok = shloks.find(
    (s) => s.chapter === Number(chapter) && s.verse === Number(verse),
  );

  if (!shlok) {
    throw notFound();
  }

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
            <div className="text-[11px] uppercase tracking-[0.2em] text-muted-foreground">
              श्रीमद्भगवद्गीता
            </div>
          </div>
        </Link>
        <nav className="hidden gap-8 text-sm font-semibold uppercase tracking-widest text-muted-foreground md:flex">
          <Link to="/" className="transition-colors hover:text-foreground">Today</Link>
          <Link to="/favorites" className="transition-colors hover:text-foreground">Favorites</Link>
        </nav>
      </header>

      <section className="relative z-10 mx-auto max-w-3xl px-6 pb-24 pt-6">
        <div className="mb-6 flex items-center gap-2 text-sm text-muted-foreground">
          <Link to="/" className="transition-colors hover:text-foreground">← Home</Link>
          <span>/</span>
          <span>Chapter {shlok.chapter}</span>
          <span>/</span>
          <span className="text-primary">Verse {shlok.verse}</span>
        </div>

        <article className="paper gold-frame overflow-hidden rounded-3xl px-8 py-12 md:px-14 md:py-14">
          <div className="mb-8 flex items-center justify-between">
            <span className="text-xs uppercase tracking-[0.25em] text-muted-foreground">
              Bhagavad Gītā · {shlok.chapter}.{shlok.verse}
            </span>
          </div>

          <div className="mb-6 flex items-center justify-center gap-3">
            <span className="h-px w-12 bg-gradient-to-r from-transparent to-gold" />
            <span className="devanagari text-2xl text-primary">॥ श्लोक ॥</span>
            <span className="h-px w-12 bg-gradient-to-l from-transparent to-gold" />
          </div>

          <p className="devanagari whitespace-pre-line text-2xl leading-relaxed text-foreground md:text-3xl">
            {shlok.sanskrit}
          </p>

          <p className="mt-6 whitespace-pre-line font-display text-base italic text-muted-foreground md:text-lg">
            {shlok.transliteration}
          </p>

          <div className="my-10 flex items-center justify-center gap-4">
            <span className="h-px w-16 bg-border" />
            <span className="text-[10px] uppercase tracking-[0.3em] text-muted-foreground">meaning</span>
            <span className="h-px w-16 bg-border" />
          </div>

          <div className="grid gap-8 text-left md:grid-cols-2">
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
        </article>
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
