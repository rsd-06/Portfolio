import { MetadataRoute } from 'next';
import { SITE_URL } from '@/lib/site';

// Everything public is crawlable, including by AI crawlers (GPTBot, ClaudeBot,
// PerplexityBot, Google-Extended) — being findable by LLM search is a goal.
// Only the GitHub proxy routes, which hold no content, are excluded.
export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: '/api/',
    },
    sitemap: `${SITE_URL}/sitemap.xml`,
    host: SITE_URL,
  };
}
