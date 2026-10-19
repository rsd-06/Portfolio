// src/components/blogs/PostSources.tsx
// The material a post was written from, shown at its end: YouTube videos as
// embedded players, articles as cards. Fed by `sources:` in the post's
// frontmatter (parsed in lib/mdx).

import type { PostSource } from "@/lib/mdx";

type Video = Extract<PostSource, { type: "youtube" }>;
type Article = Extract<PostSource, { type: "article" }>;

const formatDate = (date: string) =>
  new Date(`${date.slice(0, 10)}T00:00:00Z`).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric", timeZone: "UTC" });

function VideoEmbed({ video }: { video: Video }) {
  return (
    <figure className="flex flex-col gap-3 !m-0">
      <div className="relative w-full aspect-video overflow-hidden rounded-xl border border-[color-mix(in_srgb,var(--color-text)_12%,transparent)] bg-black">
        {/* youtube-nocookie sets no tracking cookies until the visitor plays;
            loading="lazy" keeps several players from loading up front. */}
        <iframe
          src={`https://www.youtube-nocookie.com/embed/${video.id}?rel=0`}
          title={video.title}
          loading="lazy"
          allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          referrerPolicy="strict-origin-when-cross-origin"
          allowFullScreen
          className="absolute inset-0 w-full h-full border-0"
        />
      </div>
      <figcaption className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1 f-mono text-xs uppercase tracking-widest">
        <span className="opacity-80 normal-case tracking-normal f-accent text-base">
          {video.title}
          {video.creator && <span className="opacity-60"> · {video.creator}</span>}
        </span>
        <a href={`https://www.youtube.com/watch?v=${video.id}`} target="_blank" rel="noopener noreferrer" className="opacity-60 hover:opacity-100 !no-underline">
          Watch on YouTube ↗
        </a>
      </figcaption>
    </figure>
  );
}

function ArticleCard({ article }: { article: Article }) {
  const host = new URL(article.url).host.replace(/^www\./, "");
  return (
    <a
      href={article.url}
      target="_blank"
      rel="noopener noreferrer"
      className="group flex flex-col sm:flex-row overflow-hidden rounded-xl border border-[color-mix(in_srgb,var(--color-text)_12%,transparent)] !no-underline !opacity-100 hover:border-[color-mix(in_srgb,var(--color-text)_35%,transparent)] transition-colors"
      style={{ background: "var(--bg-surface)" }}
    >
      {article.image && (
        // eslint-disable-next-line @next/next/no-img-element -- remote publisher image; not worth a remotePatterns entry per source
        <img src={article.image} alt="" loading="lazy" className="w-full sm:w-56 aspect-video sm:aspect-auto object-cover shrink-0" />
      )}
      <div className="flex flex-col gap-2 p-5 min-w-0">
        <span className="f-mono text-2xs uppercase tracking-widest opacity-60">
          {article.publisher ?? host}
          {article.date && ` · ${formatDate(article.date)}`}
        </span>
        <span className="f-display text-2xl leading-tight">{article.title}</span>
        {article.description && <span className="text-base font-light opacity-75 leading-snug">{article.description}</span>}
        <span className="f-mono text-xs uppercase tracking-widest opacity-60 group-hover:opacity-100 transition-opacity mt-1">
          {article.author ? `${article.author} · ` : ""}Read the article ↗
        </span>
      </div>
    </a>
  );
}

export default function PostSources({ sources }: { sources: PostSource[] }) {
  if (sources.length === 0) return null;
  const videos = sources.filter((s): s is Video => s.type === "youtube");
  const articles = sources.filter((s): s is Article => s.type === "article");

  return (
    <section aria-labelledby="post-sources" className="mt-20 flex flex-col gap-6">
      <div className="flex items-baseline justify-between gap-4 border-b border-[color-mix(in_srgb,var(--color-text)_15%,transparent)] pb-3">
        <h2 id="post-sources" className="f-mono text-xs uppercase tracking-[0.2em] opacity-70 !m-0">
          Sources
        </h2>
        <span className="f-mono text-2xs uppercase tracking-widest opacity-40">
          {videos.length > 0 && `${videos.length} video${videos.length > 1 ? "s" : ""}`}
          {videos.length > 0 && articles.length > 0 && " · "}
          {articles.length > 0 && `${articles.length} article${articles.length > 1 ? "s" : ""}`}
        </span>
      </div>
      {articles.map((a) => (
        <ArticleCard key={a.url} article={a} />
      ))}
      {videos.length > 0 && (
        <div className={videos.length > 1 ? "grid grid-cols-1 md:grid-cols-2 gap-8" : "flex flex-col"}>
          {videos.map((v) => (
            <VideoEmbed key={v.id} video={v} />
          ))}
        </div>
      )}
    </section>
  );
}
