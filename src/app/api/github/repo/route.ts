const TOKEN = process.env.GITHUB_TOKEN;

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const owner = searchParams.get("owner");
  const repo = searchParams.get("repo");

  if (!owner || !repo) {
    return Response.json({ error: "Missing owner or repo" }, { status: 400 });
  }

  const since = new Date();
  since.setDate(since.getDate() - 30);

  try {
    const headers: Record<string, string> = {
      Accept: "application/vnd.github+json",
      "User-Agent": "rsd-portfolio",
    };
    if (TOKEN) headers.Authorization = `Bearer ${TOKEN}`;

    const res = await fetch(
      `https://api.github.com/repos/${owner}/${repo}/commits?since=${since.toISOString()}&per_page=100`,
      { headers, next: { revalidate: 86400 } }
    );

    if (!res.ok) throw new Error(`GitHub ${res.status}`);

    const commits: any[] = await res.json();

    // Initialize last 30 days to 0
    const dayCounts: Record<string, number> = {};
    for (let i = 0; i < 30; i++) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      dayCounts[d.toISOString().split("T")[0]] = 0;
    }

    for (const commit of commits) {
      const date = (commit.commit?.author?.date ?? "").split("T")[0];
      if (date in dayCounts) dayCounts[date]++;
    }

    const days = Object.entries(dayCounts)
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([date, count]) => ({ date, count }));

    return Response.json({ days, total: commits.length, repoName: repo });
  } catch (err: any) {
    return Response.json({ error: err.message ?? "Unavailable" }, { status: 500 });
  }
}
