export default function robots() {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/api/', '/checkout'], 
    },
    sitemap: 'https://event-ticketing-platform-chi.vercel.app/sitemap.xml',
  };
}