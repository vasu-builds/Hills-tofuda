import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/admin', '/admin/'],
      },
    ],
    sitemap: 'https://hills-tofuda.vercel.app/sitemap.xml',
    host: 'https://hills-tofuda.vercel.app',
  }
}
