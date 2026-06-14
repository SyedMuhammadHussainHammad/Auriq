import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  const baseUrl = 'https://auriqfragrances.com';

  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/admin/', '/checkout/'],
    },
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
