import type { MetadataRoute } from 'next';

export default function sitemap(): MetadataRoute.Sitemap {
  const base = 'https://kitogo.health';
  const now = new Date();

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: base, lastModified: now, changeFrequency: 'weekly', priority: 1.0 },
    { url: `${base}/about`, lastModified: now, changeFrequency: 'monthly', priority: 0.8 },
    { url: `${base}/resources`, lastModified: now, changeFrequency: 'weekly', priority: 0.8 },
    { url: `${base}/careers`, lastModified: now, changeFrequency: 'weekly', priority: 0.7 },
    { url: `${base}/demo`, lastModified: now, changeFrequency: 'monthly', priority: 0.9 },
  ];

  const personaRoutes: MetadataRoute.Sitemap = ['ed-directors', 'urgent-care', 'telehealth', 'multisite'].map(p => ({
    url: `${base}/for/${p}`,
    lastModified: now,
    changeFrequency: 'monthly' as const,
    priority: 0.7,
  }));

  return [...staticRoutes, ...personaRoutes];
}
