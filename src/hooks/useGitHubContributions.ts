import { useState, useEffect } from "react";

export interface ContributionDay {
  date: string;
  count: number;
  color: string;
}

export interface GitHubData {
  thisYearTotal: number;
  last90Total: number;
  streak: number;
  days: ContributionDay[];
}

const CACHE_KEY = "gh-contributions-gql-v1";
const TTL = 86_400_000; // 24 hours

export function useGitHubContributions() {
  const [data, setData] = useState<GitHubData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(CACHE_KEY);
      if (raw) {
        const { data: cached, ts } = JSON.parse(raw);
        if (Date.now() - ts < TTL) {
          setData(cached);
          setLoading(false);
          return;
        }
      }
    } catch { /* ignore */ }

    fetch("/api/github")
      .then((r) => r.json())
      .then((d) => {
        if (d.error) throw new Error(d.error);
        setData(d);
        localStorage.setItem(CACHE_KEY, JSON.stringify({ data: d, ts: Date.now() }));
      })
      .catch((e) => setError(e.message ?? "GitHub data unavailable"))
      .finally(() => setLoading(false));
  }, []);

  return { data, loading, error };
}
