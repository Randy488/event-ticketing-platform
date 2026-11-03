import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      // Jangan biarkan Google mengindex API atau halaman checkout
      disallow: ['/api/', '/checkout'], 
    },
    sitemap: 'https://event-ticketing-platform-chi.vercel.app/sitemap.xml',
  };
}