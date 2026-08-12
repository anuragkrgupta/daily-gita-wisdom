import { useEffect, useState, useCallback } from "react";

const KEY = "daily-gita:favorites";

export type FavoriteId = string; // "chapter-verse"

export const favId = (chapter: number, verse: number): FavoriteId => `${chapter}-${verse}`;

function read(): FavoriteId[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(KEY);
    return raw ? (JSON.parse(raw) as FavoriteId[]) : [];
  } catch {
    return [];
  }
}

function write(ids: FavoriteId[]) {
  try {
    window.localStorage.setItem(KEY, JSON.stringify(ids));
    window.dispatchEvent(new Event("favorites:changed"));
  } catch {
    /* ignore */
  }
}

export function useFavorites() {
  const [ids, setIds] = useState<FavoriteId[]>([]);

  useEffect(() => {
    setIds(read());
    const sync = () => setIds(read());
    window.addEventListener("favorites:changed", sync);
    window.addEventListener("storage", sync);
    return () => {
      window.removeEventListener("favorites:changed", sync);
      window.removeEventListener("storage", sync);
    };
  }, []);

  const isFavorite = useCallback(
    (chapter: number, verse: number) => ids.includes(favId(chapter, verse)),
    [ids],
  );

  const toggle = useCallback((chapter: number, verse: number) => {
    const id = favId(chapter, verse);
    const current = read();
    const next = current.includes(id) ? current.filter((x) => x !== id) : [...current, id];
    write(next);
    setIds(next);
  }, []);

  return { ids, isFavorite, toggle };
}
