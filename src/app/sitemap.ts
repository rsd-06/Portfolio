import { MetadataRoute } from 'next';
import { PROJECTS } from '@/data/projects';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://rsd.exe';

  // Base routes — ordered by importance
  const routes = [
    { path: '',           priority: 1.0,  freq: 'weekly'  },
    { path: '/about',     priority: 0.9,  freq: 'weekly'  },
    { path: '/projects',  priority: 0.9,  freq: 'weekly'  },
    { path: '/blogs',     priority: 0.8,  freq: 'weekly'  },
    { path: '/contact',   priority: 0.7,  freq: 'monthly' },
  ].map(({ path, priority, freq }) => ({
    url: `${baseUrl}${path}`,
    lastModified: new Date().toISOString(),
    changeFrequency: freq as 'weekly' | 'monthly',
    priority,
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
