import { MetadataRoute } from 'next'
import { RECIPES } from '@/lib/recipes'

const BASE_URL = 'https://hills-tofuda.vercel.app'

export default function sitemap(): MetadataRoute.Sitemap {
  const staticPages = [
    { url: BASE_URL,               changeFrequency: 'weekly' as const,  priority: 1.0 },
    { url: `${BASE_URL}/products`, changeFrequency: 'weekly' as const,  priority: 0.9 },
    { url: `${BASE_URL}/recipes`,  changeFrequency: 'weekly' as const,  priority: 0.9 },
    { url: `${BASE_URL}/story`,    changeFrequency: 'monthly' as const, priority: 0.7 },
    { url: `${BASE_URL}/why`,      changeFrequency: 'monthly' as const, priority: 0.8 },
    { url: `${BASE_URL}/order`,    changeFrequency: 'weekly' as const,  priority: 0.95 },
  ]

  const recipePages = RECIPES.map(recipe => ({
    url: `${BASE_URL}/recipes/${recipe.slug}`,
    changeFrequency: 'monthly' as const,
    priority: 0.8,
  }))

  return [
    ...staticPages.map(page => ({
      ...page,
      lastModified: new Date(),
    })),
    ...recipePages.map(page => ({
      ...page,
      lastModified: new Date(),
    })),
  ]
}
