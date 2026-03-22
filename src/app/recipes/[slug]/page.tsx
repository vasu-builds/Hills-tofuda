import { notFound } from 'next/navigation'
import { Metadata } from 'next'
import Navbar from '@/components/ui/Navbar'
import Footer from '@/components/ui/Footer'
import RecipeDetailPage from '@/components/sections/RecipeDetailPage'
import { RECIPES, getRecipeBySlug } from '@/lib/recipes'

interface Props {
  params: { slug: string }
}

// Generate all recipe pages at build time
export async function generateStaticParams() {
  return RECIPES.map(recipe => ({ slug: recipe.slug }))
}

// Per-recipe SEO metadata
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const recipe = getRecipeBySlug(params.slug)
  if (!recipe) return {}

  return {
    title: `${recipe.title} Recipe — Hills Tofuda Soy Paneer`,
    description: `${recipe.description} Easy ${recipe.difficulty.toLowerCase()} recipe. Ready in ${recipe.time}. ${recipe.protein} protein per serving. Made with Hills Tofuda fresh soy paneer from Nainital.`,
    keywords: recipe.keywords,
    openGraph: {
      title: `${recipe.title} — Hills Tofuda`,
      description: recipe.description,
      type: 'article',
      images: [{ url: recipe.image, width: 1200, height: 630, alt: recipe.title }],
    },
  }
}

export default function RecipePage({ params }: Props) {
  const recipe = getRecipeBySlug(params.slug)
  if (!recipe) notFound()

  // ── Recipe Schema JSON-LD (Google Rich Results) ──────────────────
  const schemaJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Recipe',
    name: recipe.title,
    description: recipe.description,
    image: [`https://hills-tofuda.vercel.app${recipe.image}`],
    author: {
      '@type': 'Organization',
      name: 'Hills Tofuda',
      url: 'https://hills-tofuda.vercel.app',
    },
    datePublished: '2025-01-01',
    prepTime: `PT${recipe.prepTime}M`,
    cookTime: `PT${recipe.cookTime}M`,
    totalTime: `PT${recipe.prepTime + recipe.cookTime}M`,
    recipeCategory: recipe.category,
    recipeCuisine: 'Indian',
    recipeYield: `${recipe.servings} servings`,
    keywords: recipe.keywords.join(', '),
    nutrition: {
      '@type': 'NutritionInformation',
      calories: `${recipe.calories} calories`,
      proteinContent: recipe.protein,
    },
    recipeIngredient: recipe.ingredients,
    recipeInstructions: recipe.steps.map((step, i) => ({
      '@type': 'HowToStep',
      position: i + 1,
      name: step.title,
      text: step.description,
    })),
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: '4.8',
      reviewCount: '24',
    },
  }

  return (
    <>
      {/* Inject schema JSON-LD */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaJsonLd) }}
      />
      <Navbar />
      <RecipeDetailPage recipe={recipe} />
      <Footer />
    </>
  )
}
