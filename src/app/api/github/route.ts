const USERNAME = "rsd-06";
const TOKEN = process.env.GITHUB_TOKEN;
const GQL = "https://api.github.com/graphql";

function computeStreak(days: { date: string; count: number }[]): number {
  const sorted = [...days].sort((a, b) => b.date.localeCompare(a.date));
  const today = new Date().toISOString().split("T")[0];
  let streak = 0;
  for (const day of sorted) {
    if (day.count > 0) streak++;
    else if (day.date !== today) break;
  }
  return streak;
}

export async function GET() {
  if (!TOKEN) {
    return Response.json({ error: "GITHUB_TOKEN not set" }, { status: 500 });
  }

  const now = new Date();
  const ago90 = new Date(now);
  ago90.setDate(ago90.getDate() - 90);

  const query = `{
    user(login: "${USERNAME}") {
      thisYear: contributionsCollection {
        contributionCalendar {
          totalContributions
          weeks {
            contributionDays { date contributionCount color }
          }
        }
      }
      last90: contributionsCollection(from: "${ago90.toISOString()}" to: "${now.toISOString()}") {
        contributionCalendar { totalContributions }
      }
    }
  }`;

  try {
    const res = await fetch(GQL, {
      method: "POST",
      headers: {
        Authorization: `bearer ${TOKEN}`,
        "Content-Type": "application/json",
        "User-Agent": "rsd-portfolio",
      },
      body: JSON.stringify({ query }),
      next: { revalidate: 86400 }, // 24h ISR cache
    });

    if (!res.ok) throw new Error(`GitHub ${res.status}`);

    const json = await res.json();
    if (json.errors) throw new Error(json.errors[0]?.message ?? "GraphQL error");

    const { thisYear, last90 } = json.data.user;
    const days = thisYear.contributionCalendar.weeks.flatMap((w: any) =>
      w.contributionDays.map((d: any) => ({
        date: d.date,
        count: d.contributionCount,
        color: d.color,
      }))
    );

    return Response.json({
      thisYearTotal: thisYear.contributionCalendar.totalContributions,
      last90Total: last90.contributionCalendar.totalContributions,
      streak: computeStreak(days),
      days,
    });
  } catch (err: any) {
    return Response.json({ error: err.message ?? "Unavailable" }, { status: 500 });
  }
}
