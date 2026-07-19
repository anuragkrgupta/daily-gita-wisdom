import { createFileRoute, Link, useRouter } from "@tanstack/react-router";
import { useState } from "react";
import { shloks } from "@/lib/shloks";
import { useFavorites, favId } from "@/lib/favorites";

export const Route = createFileRoute("/favorites")({
  head: () => ({
    meta: [
      { title: "Your Favorite Shloks — Daily Gita" },
      {
        name: "description",
        content:
          "Your personally saved verses from the Bhagavad Gita — collected for daily reflection.",
      },
      { property: "og:title", content: "Your Favorite Shloks — Daily Gita" },
      {
        property: "og:description",
        content: "Verses from the Bhagavad Gita you've saved to return to.",
      },
    ],
  }),
  component: FavoritesPage,
});

function FavoritesPage() {
  const { ids, toggle } = useFavorites();
  const favorites = shloks.filter((s) => ids.includes(favId(s.chapter, s.verse)));
  const router = useRouter();

  return (
    <div className="relative min-h-screen overflow-hidden">
      <header className="relative z-10 mx-auto flex max-w-6xl items-center justify-between px-6 py-8">
        <Link to="/" className="flex items-center gap-3">
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
        </Link>
        <nav className="hidden gap-8 text-sm text-muted-foreground md:flex">
          <Link to="/" className="hover:text-primary transition-colors">Today</Link>
          <Link to="/favorites" className="text-primary">Favorites</Link>
        </nav>
      </header>

      <section className="relative z-10 mx-auto max-w-6xl px-6 pb-24 pt-6">
        <div className="mb-10">
          <div className="text-xs uppercase tracking-[0.25em] text-saffron">Favorites</div>
          <h1 className="font-display text-4xl text-primary md:text-5xl">
            Verses you've saved
          </h1>
          <p className="mt-3 text-muted-foreground">
            {favorites.length === 0
              ? "You haven't saved any shloks yet. Tap the heart on any verse to keep it here."
              : `${favorites.length} shlok${favorites.length === 1 ? "" : "s"} saved for your reflection.`}
          </p>
        </div>

        {favorites.length === 0 ? (
          <div className="paper gold-frame rounded-2xl px-8 py-16 text-center">
            <div className="devanagari text-3xl text-saffron">॥ ॐ ॥</div>
            <p className="mt-4 font-display text-lg italic text-muted-foreground">
              Every journey begins with a single verse.
            </p>
            <Link
              to="/"
              className="mt-6 inline-flex items-center justify-center rounded-md bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground hover:bg-primary/90"
            >
              Browse shloks →
            </Link>
          </div>
        ) : (
          <div className="grid gap-6">
            {favorites.map((s) => (
              <article
                key={`${s.chapter}-${s.verse}`}
                className="paper gold-frame relative overflow-hidden rounded-2xl px-6 py-8 md:px-10 md:py-10"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="text-xs uppercase tracking-[0.25em] text-muted-foreground">
                    Bhagavad Gītā · {s.chapter}.{s.verse}
                  </div>
                  <div className="flex items-center gap-2">
                    <ShareButton chapter={s.chapter} verse={s.verse} router={router} />
                    <button
                      onClick={() => toggle(s.chapter, s.verse)}
                      aria-label="Remove from favorites"
                      className="rounded-full border border-crimson/40 bg-card/70 px-3 py-1 text-xs text-crimson transition hover:bg-crimson hover:text-white"
                    >
                      ♥ Remove
                    </button>
                  </div>
                </div>
                <p className="devanagari mt-5 whitespace-pre-line text-xl leading-relaxed text-primary md:text-2xl">
                  {s.sanskrit}
                </p>
                <div className="mt-6 grid gap-6 md:grid-cols-2">
                  <p className="devanagari text-base leading-relaxed text-foreground">
                    {s.hindi}
                  </p>
                  <p className="font-display text-base italic leading-relaxed text-foreground">
                    {s.english}
                  </p>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}