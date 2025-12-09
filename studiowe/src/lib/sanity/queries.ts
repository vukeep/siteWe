/**
 * Sanity GROQ Queries
 * 
 * GROQ (Graph-Relational Object Queries) - язык запросов Sanity.
 * Все функции для получения данных портфолио из Sanity CMS.
 * 
 * Особенности:
 * - ISR с revalidate: 3600 (1 час)
 * - Tags для точечной ревалидации
 * - Type-safe возвращаемые данные
 */

import { client } from '../../../sanity/lib/client'
import type { PortfolioItem } from '../types/portfolio'

/**
 * Homepage Settings Type
 */
export interface ProblemSolutionSlide {
  title: string
  textColor?: {
    hex: string
    alpha: number
  }
  images: string[]
}

export interface HomepageSettings {
  // Hero Video
  heroVideoEnabled: boolean
  heroVideoTitle?: string
  heroVideoUrl?: string
  heroPosterUrl?: string
  heroVideoAutoplay: boolean
  heroVideoMuted: boolean
  heroVideoLoop: boolean
}

/**
 * Site Settings Type (Глобальные настройки)
 */
export interface SiteSettings {
  backgroundColor?: {
    hex: string
    alpha: number
  }
  headingColor?: {
    hex: string
    alpha: number
  }
  buttonColor?: {
    hex: string
    alpha: number
  }
  buttonHoverColor?: {
    hex: string
    alpha: number
  }
  title?: string
  description?: string
}

/**
 * Trading Niche Type (Торговая ниша)
 */
export interface TradingNiche {
  id: string
  title: string
  icon: string
  slug: string
  description: string
  order: number
  subcategories: string[]
  mediaType: 'video' | 'image'
  optimizedMediaUrl: string
  posterUrl?: string
  videoAutoplay?: boolean
  videoLoop?: boolean
  videoMuted?: boolean
  published: boolean
}

/**
 * Pricing Plan Type (Тарифный план)
 */
export interface PricingPlan {
  id: string
  name: string
  videoCount: string
  price: number
  duration: string
  features: string[]
  recommended: boolean
  order: number
  published: boolean
}

/**
 * Pricing Settings Type (Настройки секции тарифов)
 */
export interface PricingSettings {
  title: string
  subtitle: string
  basePricePerTenSeconds: number
  basePriceDescription: string
  customProjectTitle: string
  customProjectDescription: string
  customProjectHighlight: string
  customProjectButtonText: string
}

/**
 * FAQ Item Type (Вопрос-ответ)
 */
export interface FAQItem {
  id: string
  question: string
  answer: string
  order: number
  published: boolean
}

/**
 * FAQ Settings Type (Настройки секции FAQ)
 */
export interface FAQSettings {
  title: string
  subtitle: string
  ctaText: string
  ctaButtonText: string
}

/**
 * GROQ Projection для portfolio
 * Трансформирует данные из Sanity в формат PortfolioItem
 */
const portfolioProjection = `{
  "id": _id,
  "slug": slug.current,
  title,
  description,
  category,
  videoUrl,
  posterUrl,
  duration,
  tags,
  publishedAt,
  featured,
  viewCount
}`

/**
 * Получить список проектов портфолио с фильтрацией
 * 
 * @param filters - Опциональные фильтры (category, featured, limit)
 * @returns Promise<PortfolioItem[]>
 * 
 * @example
 * ```ts
 * // Получить все избранные проекты
 * const featured = await getPortfolioItems({ featured: true, limit: 6 })
 * 
 * // Получить проекты категории "marketing"
 * const marketing = await getPortfolioItems({ category: 'marketing' })
 * ```
 */
export async function getPortfolioItems(filters?: {
  category?: string
  featured?: boolean
  limit?: number
}): Promise<PortfolioItem[]> {
  // Базовый запрос
  let query = '*[_type == "portfolio"'

  // Фильтр по категории
  if (filters?.category) {
    query += ` && category == "${filters.category}"`
  }

  // Фильтр по featured
  if (filters?.featured !== undefined) {
    query += ` && featured == ${filters.featured}`
  }

  query += '] | order(publishedAt desc)'

  // Лимит
  if (filters?.limit) {
    query += ` [0...${filters.limit}]`
  }

  query += portfolioProjection

  const items = await client.fetch<PortfolioItem[]>(
    query,
    {},
    {
      next: {
        revalidate: 3600, // Обновлять каждый час
        tags: ['portfolio'] // Тег для точечной ревалидации
      }
    }
  )
  
  return items
}

/**
 * Получить один проект по slug
 * 
 * @param slug - URL slug проекта
 * @returns Promise<PortfolioItem | null>
 * 
 * @example
 * ```ts
 * const project = await getPortfolioItemBySlug('marketing-campaign-tech')
 * if (!project) {
 *   notFound()
 * }
 * ```
 */
export async function getPortfolioItemBySlug(slug: string): Promise<PortfolioItem | null> {
  const query = `*[_type == "portfolio" && slug.current == $slug][0]${portfolioProjection}`

  const item = await client.fetch<PortfolioItem | null>(
    query,
    { slug },
    {
      next: {
        revalidate: 3600,
        tags: [`portfolio-${slug}`]
      }
    }
  )

  return item || null
}

/**
 * Получить похожие проекты (та же категория, исключая текущий)
 * 
 * @param currentSlug - Slug текущего проекта (исключить из результатов)
 * @param category - Категория для поиска похожих
 * @param limit - Количество проектов (по умолчанию 3)
 * @returns Promise<PortfolioItem[]>
 */
export async function getRelatedProjects(
  currentSlug: string,
  category: string,
  limit: number = 3
): Promise<PortfolioItem[]> {
  const query = `*[_type == "portfolio" && slug.current != $currentSlug && category == $category] [0...$limit]${portfolioProjection}`

  return client.fetch<PortfolioItem[]>(
    query,
    { currentSlug, category, limit },
    {
      next: {
        revalidate: 3600,
        tags: ['portfolio']
      }
    }
  )
}

/**
 * Получить все slug'и портфолио (для generateStaticParams)
 * 
 * @returns Promise<string[]>
 */
export async function getAllPortfolioSlugs(): Promise<string[]> {
  const query = `*[_type == "portfolio"].slug.current`
  
  const slugs = await client.fetch<string[]>(query, {}, {
    next: {
      revalidate: 3600,
      tags: ['portfolio']
    }
  })
  
  return slugs
}

/**
 * Получить информацию о проекте для metadata (легковесный запрос)
 * 
 * @param slug - URL slug проекта
 * @returns Promise с основными полями для meta tags
 */
export async function getPortfolioMetadata(slug: string) {
  const query = `*[_type == "portfolio" && slug.current == $slug][0]{
    title,
    description,
    posterUrl,
    publishedAt
  }`
  
  return client.fetch(query, { slug }, {
    next: {
      revalidate: 3600,
      tags: [`portfolio-${slug}`]
    }
  })
}

/**
 * Получить настройки главной страницы
 * 
 * @returns Promise<HomepageSettings | null>
 */
export async function getHomepageSettings(): Promise<HomepageSettings | null> {
  // Singleton документ с фиксированным ID
  const query = `*[_type == "homepage" && _id == "homepage"][0]{
    heroVideoEnabled,
    heroVideoTitle,
    heroVideoUrl,
    heroPosterUrl,
    heroVideoAutoplay,
    heroVideoMuted,
    heroVideoLoop
  }`

  const revalidateTime = process.env.NODE_ENV === 'development' ? 10 : 3600

  const settings = await client.fetch<HomepageSettings | null>(
    query,
    {},
    {
      next: {
        revalidate: revalidateTime, 
        tags: ['homepage'] 
      }
    }
  )

  return settings || null
}

/**
 * Получить глобальные настройки сайта (цвета, SEO)
 * 
 * @returns Promise<SiteSettings | null>
 */
export async function getSiteSettings(): Promise<SiteSettings | null> {
  const query = `*[_type == "siteSettings" && _id == "siteSettings"][0]{
    backgroundColor,
    headingColor,
    buttonColor,
    buttonHoverColor,
    title,
    description
  }`

  const revalidateTime = process.env.NODE_ENV === 'development' ? 10 : 3600

  const settings = await client.fetch<SiteSettings | null>(
    query,
    {},
    {
      next: {
        revalidate: revalidateTime,
        tags: ['site-settings']
      }
    }
  )

  return settings || null
}

/**
 * Получить все слайды для карусели "Проблема/Решение"
 * 
 * @returns Promise<ProblemSolutionSlide[]>
 */
export async function getProblemSolutionSlides(): Promise<ProblemSolutionSlide[]> {
  // Обновленный запрос: используем coalesce чтобы взять первое не-null значение из двух вариантов
  const query = `*[_type == "problemSolutionSlide"] | order(order asc) {
    title,
    textColor,
    "images": images[]{
      "url": coalesce(url, asset->url)
    }.url
  }`

  const revalidateTime = process.env.NODE_ENV === 'development' ? 10 : 3600

  const slides = await client.fetch<ProblemSolutionSlide[]>(
    query,
    {},
    {
      next: {
        revalidate: revalidateTime,
        tags: ['problemSolutionSlide'] // Тег для ревалидации (нужно добавить в webhook)
      }
    }
  )

  return slides
}

/**
 * Получить все торговые ниши (форматы роликов)
 * 
 * @returns Promise<TradingNiche[]>
 */
export async function getTradingNiches(): Promise<TradingNiche[]> {
  // Запрос только опубликованных ниш, отсортированных по order
  const query = `*[_type == "tradingNiches" && published == true] | order(order asc) {
    "id": _id,
    title,
    icon,
    "slug": slug.current,
    description,
    order,
    subcategories,
    mediaType,
    optimizedMediaUrl,
    posterUrl,
    videoAutoplay,
    videoLoop,
    videoMuted,
    published
  }`

  const revalidateTime = process.env.NODE_ENV === 'development' ? 10 : 3600

  const niches = await client.fetch<TradingNiche[]>(
    query,
    {},
    {
      next: {
        revalidate: revalidateTime,
        tags: ['tradingNiches']
      }
    }
  )

  return niches
}

/**
 * Получить все тарифные планы
 * 
 * @returns Promise<PricingPlan[]>
 */
export async function getPricingPlans(): Promise<PricingPlan[]> {
  // Запрос только опубликованных тарифов, отсортированных по order
  const query = `*[_type == "pricingPlan" && published == true] | order(order asc) {
    "id": _id,
    name,
    videoCount,
    price,
    duration,
    features,
    recommended,
    order,
    published
  }`

  const revalidateTime = process.env.NODE_ENV === 'development' ? 10 : 3600

  const plans = await client.fetch<PricingPlan[]>(
    query,
    {},
    {
      next: {
        revalidate: revalidateTime,
        tags: ['pricingPlan']
      }
    }
  )

  return plans
}

/**
 * Получить настройки секции тарифов
 * 
 * @returns Promise<PricingSettings | null>
 */
export async function getPricingSettings(): Promise<PricingSettings | null> {
  // Singleton документ с фиксированным ID
  const query = `*[_type == "pricingSettings" && _id == "pricingSettings"][0]{
    title,
    subtitle,
    basePricePerTenSeconds,
    basePriceDescription,
    customProjectTitle,
    customProjectDescription,
    customProjectHighlight,
    customProjectButtonText
  }`

  const revalidateTime = process.env.NODE_ENV === 'development' ? 10 : 3600

  const settings = await client.fetch<PricingSettings | null>(
    query,
    {},
    {
      next: {
        revalidate: revalidateTime,
        tags: ['pricingSettings']
      }
    }
  )

  return settings || null
}

/**
 * Получить все FAQ элементы
 * 
 * @returns Promise<FAQItem[]>
 */
export async function getFAQItems(): Promise<FAQItem[]> {
  // Запрос только опубликованных FAQ, отсортированных по order
  const query = `*[_type == "faqItem" && published == true] | order(order asc) {
    "id": _id,
    question,
    answer,
    order,
    published
  }`

  const revalidateTime = process.env.NODE_ENV === 'development' ? 10 : 3600

  const items = await client.fetch<FAQItem[]>(
    query,
    {},
    {
      next: {
        revalidate: revalidateTime,
        tags: ['faqItem']
      }
    }
  )

  return items
}

/**
 * Получить настройки секции FAQ
 * 
 * @returns Promise<FAQSettings | null>
 */
export async function getFAQSettings(): Promise<FAQSettings | null> {
  // Singleton документ с фиксированным ID
  const query = `*[_type == "faqSettings" && _id == "faqSettings"][0]{
    title,
    subtitle,
    ctaText,
    ctaButtonText
  }`

  const revalidateTime = process.env.NODE_ENV === 'development' ? 10 : 3600

  const settings = await client.fetch<FAQSettings | null>(
    query,
    {},
    {
      next: {
        revalidate: revalidateTime,
        tags: ['faqSettings']
      }
    }
  )

  return settings || null
}
