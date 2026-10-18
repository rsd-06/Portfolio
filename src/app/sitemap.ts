import { MetadataRoute } from 'next';
import { PROJECTS } from '@/data/projects';
import { DOCUMENTED } from '@/data/protosem';
import { getAllBlogs } from '@/lib/mdx';
import { SITE_URL } from '@/lib/site';

// lastModified is only set where a real date exists. Stamping every entry with
// "now" on each build told crawlers that every page changed every deploy.
export default function sitemap(): MetadataRoute.Sitemap {
  const blogs = getAllBlogs();
  const latestPost = blogs[0]?.date;

  const routes: MetadataRoute.Sitemap = [
    { url: SITE_URL, priority: 1.0, changeFrequency: 'weekly' },
    { url: `${SITE_URL}/about`, priority: 0.9, changeFrequency: 'monthly' },
    { url: `${SITE_URL}/projects`, priority: 0.9, changeFrequency: 'weekly' },
    { url: `${SITE_URL}/protosem`, priority: 0.8, changeFrequency: 'weekly' },
    { url: `${SITE_URL}/blogs`, priority: 0.8, changeFrequency: 'weekly', lastModified: latestPost },
    { url: `${SITE_URL}/contact`, priority: 0.6, changeFrequency: 'yearly' },
  ];

  const projectRoutes: MetadataRoute.Sitemap = PROJECTS.map((project) => ({
    url: `${SITE_URL}/projects/${project.slug}`,
    changeFrequency: 'monthly',
    priority: project.featured ? 0.8 : 0.6,
  }));

  const blogRoutes: MetadataRoute.Sitemap = blogs.map((blog) => ({
    url: `${SITE_URL}/blogs/${blog.slug}`,
    lastModified: blog.date,
    changeFrequency: 'yearly',
    priority: 0.7,
  }));

  // Week pages that actually exist. Driven off the same predicate the router
  // uses, so the sitemap can never advertise a 404.
  const protosemRoutes: MetadataRoute.Sitemap = DOCUMENTED.map((week) => ({
    url: `${SITE_URL}/protosem/${week.slug}`,
    changeFrequency: 'monthly',
    priority: 0.5,
  }));

  return [...routes, ...projectRoutes, ...blogRoutes, ...protosemRoutes];
}
