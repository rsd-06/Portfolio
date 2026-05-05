export async function GET() {
  try {
    const res = await fetch(
      "https://github-contributions-api.jogruber.de/v4/rsd-exe?y=last",
      { next: { revalidate: 3600 } } // cache for 1 hour server-side
    );

    if (!res.ok) throw new Error(`Upstream error: ${res.status}`);

    const data = await res.json();
    return Response.json(data);

  } catch {
    return Response.json(
      { error: "GitHub data unavailable" },
      { status: 500 }
    );
  }
}
