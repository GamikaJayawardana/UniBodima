import { MetadataRoute } from 'next';
import connectToDatabase from '@/lib/mongodb';
import { OfferPost } from '@/models/OfferPost';
import { RequestPost } from '@/models/RequestPost';
import { UNIVERSITIES } from '@/lib/constants';

const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.boardingfor.me';

function slugify(text: string) {
  return text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const defaultLastMod = new Date();

  // Static routes
  const staticRoutes = [
    '', '/offers', '/requests', '/how-it-works', '/safety', '/privacy', '/terms', '/cookies', '/register', '/login',
  ].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: defaultLastMod,
    changeFrequency: (route === '' || route === '/offers' || route === '/requests' ? 'hourly' : 'weekly') as any,
    priority: route === '' ? 1.0 : 0.8,
  }));

  // University landing pages (exclude the "Other" bucket)
  const universityRoutes = UNIVERSITIES.filter((u) => u !== 'Other').map((uni) => ({
    url: `${baseUrl}/university/${slugify(uni)}`,
    lastModified: defaultLastMod,
    changeFrequency: 'daily' as any,
    priority: 0.9,
  }));

  // Individual listing pages (the primary indexable content)
  let postRoutes: MetadataRoute.Sitemap = [];
  try {
    await connectToDatabase();
    const [offers, requests] = await Promise.all([
      OfferPost.find({}).select('_id updatedAt').lean(),
      RequestPost.find({}).select('_id updatedAt').lean(),
    ]);

    postRoutes = [...offers, ...requests].map((p: any) => ({
      url: `${baseUrl}/posts/${p._id.toString()}`,
      lastModified: p.updatedAt ? new Date(p.updatedAt) : defaultLastMod,
      changeFrequency: 'weekly' as any,
      priority: 0.7,
    }));
  } catch (error) {
    // If the database is unreachable at build/request time, still return the
    // static portion of the sitemap rather than failing the whole route.
    console.error('sitemap: failed to load posts', error);
  }

  return [...staticRoutes, ...universityRoutes, ...postRoutes];
}
