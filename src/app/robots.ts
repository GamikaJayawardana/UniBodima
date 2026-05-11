import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: [
        '/dashboard/',
        '/profile/',
        '/create/',
        '/edit/',
        '/api/',
        '/my-offers/',
        '/my-requests/'
      ],
    },
    sitemap: 'https://uniboarding.com/sitemap.xml',
  };
}