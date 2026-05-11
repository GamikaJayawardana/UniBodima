import { MetadataRoute } from 'next';

const allUniversities = [
  "University of Colombo", "University of Moratuwa", "University of Kelaniya",
  "University of Sri Jayewardenepura", "University of Peradeniya", "University of Ruhuna",
  "University of Jaffna", "SLIIT", "NSBM", "IIT", "Horizon Campus", "KDU",
  "Wayamba University", "Rajarata University", "Sabaragamuwa University",
  "Eastern University", "South Eastern University", "Uva Wellassa University (UWU)",
  "Open University"
];

function slugify(text: string) {
  return text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
}

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://uniboarding.com';
  const defaultLastMod = new Date();

  // Static routes
  const staticRoutes = [
    '', '/offers', '/requests', '/how-it-works', '/safety', '/privacy', '/terms', '/cookies', '/register', '/login'
  ].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: defaultLastMod,
    changeFrequency: (route === '' || route === '/offers' || route === '/requests') ? 'hourly' : 'weekly' as any,
    priority: route === '' ? 1.0 : 0.8,
  }));

  // University dynamic routes
  const universityRoutes = allUniversities.map((uni) => ({
    url: `${baseUrl}/university/${slugify(uni)}`,
    lastModified: defaultLastMod,
    changeFrequency: 'daily' as any,
    priority: 0.9,
  }));

  return [...staticRoutes, ...universityRoutes];
}