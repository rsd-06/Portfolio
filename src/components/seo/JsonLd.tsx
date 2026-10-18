// src/components/seo/JsonLd.tsx
// Structured data for search engines. "<" is escaped so content such as a blog
// title can never close the script tag early.

export default function JsonLd({ data }: { data: Record<string, unknown> }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data).replace(/</g, "\\u003c") }}
    />
  );
}
