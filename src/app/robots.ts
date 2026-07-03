import { MetadataRoute } from 'next';

const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.boardingfor.me';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: [
        '/admin',
        '/dashboard/',
        '/profile/',
        '/create/',
        '/edit/',
        '/api/',
        '/my-offers/',
        '/my-requests/',
        '/saved/',
      ],
    },
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}