import { useState, useEffect } from "react";

export interface ContributionData {
  total: {
    [year: number]: number;
    lastYear: number;
  };
  contributions: {
    date: string;
    count: number;
    level: number;
  }[];
}

export function useGitHubContributions(username: string) {
  const [data, setData] = useState<ContributionData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Check localStorage cache first (1 hour TTL)
    const cacheKey = `gh-contributions-${username}`;
    const cached = localStorage.getItem(cacheKey);

    if (cached) {
      const { data: cachedData, timestamp } = JSON.parse(cached);
      if (Date.now() - timestamp < 3600000) {
        setData(cachedData);
        setLoading(false);
        return;
      }
    }

    fetch(`/api/github`)
      .then(r => {
        if (!r.ok) throw new Error("Network response was not ok");
        return r.json();
      })
      .then(d => {
        setData(d);
        localStorage.setItem(cacheKey, JSON.stringify({
          data: d,
          timestamp: Date.now()
        }));
      })
      .catch(() => setError("GitHub data unavailable"))
      .finally(() => setLoading(false));
  }, [username]);

  return { data, loading, error };
}

export function computeStreak(contributions: { date: string; count: number }[]): number {
  if (!contributions || contributions.length === 0) return 0;
  
  const today = new Date().toISOString().split("T")[0];
  let streak = 0;

  for (let i = contributions.length - 1; i >= 0; i--) {
    if (contributions[i].count > 0) {
      streak++;
    } else if (contributions[i].date !== today) {
      break;
    }
  }

  return streak;
}
