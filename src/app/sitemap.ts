import { MetadataRoute } from 'next';
import { PROJECTS } from '@/data/projects';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://rsd.exe';

  // Base routes
  const routes = [
    '',
    '/about',
    '/projects',
  ].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date().toISOString(),
    changeFrequency: 'weekly' as const,
    priority: route === '' ? 1 : 0.8,
  }));

  // Project routes
  const projectRoutes = PROJECTS.map((project) => ({
    url: `${baseUrl}/projects/${project.slug}`,
    lastModified: new Date().toISOString(),
    changeFrequency: 'monthly' as const,
    priority: 0.6,
  }));

  return [...routes, ...projectRoutes];
}
