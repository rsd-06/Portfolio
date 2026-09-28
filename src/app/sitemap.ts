import { MetadataRoute } from 'next';
import { PROJECTS } from '@/data/projects';
import { DOCUMENTED } from '@/data/protosem';
import { SITE_URL } from '@/lib/site';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = SITE_URL;

  // Base routes — ordered by importance
  const routes = [
    { path: '',           priority: 1.0,  freq: 'weekly'  },
    { path: '/about',     priority: 0.9,  freq: 'weekly'  },
    { path: '/projects',  priority: 0.9,  freq: 'weekly'  },
    { path: '/protosem',  priority: 0.9,  freq: 'weekly'  },
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

  // Week pages that actually exist. Driven off the same predicate the router
  // uses, so the sitemap can never advertise a 404.
  const protosemRoutes = DOCUMENTED.map((week) => ({
    url: `${baseUrl}/protosem/${week.slug}`,
    lastModified: new Date().toISOString(),
    changeFrequency: 'monthly' as const,
    priority: 0.6,
  }));

  return [...routes, ...projectRoutes, ...protosemRoutes];
}
