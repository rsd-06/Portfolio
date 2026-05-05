import { useState, useEffect } from "react";

export interface RepoDay { date: string; count: number; }
export interface RepoActivityData { days: RepoDay[]; total: number; repoName: string; }

const TTL = 86_400_000;

export function useRepoActivity(repoUrl: string) {
  const [data, setData] = useState<RepoActivityData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let owner: string, repo: string;
    try {
      const parts = new URL(repoUrl).pathname.split("/").filter(Boolean);
      owner = parts[0]; repo = parts[1];
    } catch {
      setError("Invalid URL"); setLoading(false); return;
    }

    const key = `gh-repo-${owner}-${repo}-v1`;
    try {
      const raw = localStorage.getItem(key);
      if (raw) {
        const { data: cached, ts } = JSON.parse(raw);
        if (Date.now() - ts < TTL) { setData(cached); setLoading(false); return; }
      }
    } catch { /* ignore */ }

    fetch(`/api/github/repo?owner=${encodeURIComponent(owner)}&repo=${encodeURIComponent(repo)}`)
      .then((r) => r.json())
      .then((d) => {
        if (d.error) throw new Error(d.error);
        setData(d);
        localStorage.setItem(key, JSON.stringify({ data: d, ts: Date.now() }));
      })
      .catch((e) => setError(e.message ?? "Unavailable"))
      .finally(() => setLoading(false));
  }, [repoUrl]);

  return { data, loading, error };
}
