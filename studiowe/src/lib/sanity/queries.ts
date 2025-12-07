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
 * Получить список портфолио с фильтрацией
 * 
 * @param filters - Опциональные фильтры (категория, featured, лимит)
 * @returns Promise<PortfolioItem[]>
 * 
 * @example
 * ```ts
 * // Получить все проекты
 * const all = await getPortfolioItems()
 * 
 * // Получить только featured
 * const featured = await getPortfolioItems({ featured: true, limit: 8 })
 * 
 * // Фильтр по категории
 * const marketing = await getPortfolioItems({ category: 'marketing' })
 * ```
 */
export async function getPortfolioItems(filters?: {
  category?: string
  featured?: boolean
  limit?: number
}): Promise<PortfolioItem[]> {
  // Строим GROQ запрос
  let query = '*[_type == "portfolio"'
  
  // Добавляем фильтры
  if (filters?.category) {
    query += ` && category == "${filters.category}"`
  }
  
  if (filters?.featured !== undefined) {
    query += ` && featured == ${filters.featured}`
  }
  
  // Сортировка по дате публикации (новые первые)
  query += '] | order(publishedAt desc)'
  
  // Лимит результатов
  if (filters?.limit) {
    query += ` [0...${filters.limit}]`
  }
  
  // Projection (какие поля возвращать)
  query += portfolioProjection
  
  // Выполняем запрос с ISR
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
export async function getPortfolioItemBySlug(
  slug: string
): Promise<PortfolioItem | null> {
  const query = `*[_type == "portfolio" && slug.current == $slug][0]${portfolioProjection}`
  
  const item = await client.fetch<PortfolioItem | null>(
    query,
    { slug },
    {
      next: {
        revalidate: 3600,
        tags: [`portfolio-${slug}`] // Индивидуальный тег для каждого проекта
      }
    }
  )
  
  return item
}

/**
 * Получить связанные проекты (той же категории)
 * 
 * @param currentSlug - Slug текущего проекта (исключить из результатов)
 * @param category - Категория для фильтрации
 * @param limit - Максимальное количество результатов (по умолчанию 3)
 * @returns Promise<PortfolioItem[]>
 * 
 * @example
 * ```ts
 * const related = await getRelatedProjects('project-slug', 'marketing', 3)
 * ```
 */
export async function getRelatedProjects(
  currentSlug: string,
  category: string,
  limit: number = 3
): Promise<PortfolioItem[]> {
  const query = `*[_type == "portfolio" && slug.current != $currentSlug && category == $category] | order(publishedAt desc) [0...$limit]${portfolioProjection}`
  
  const items = await client.fetch<PortfolioItem[]>(
    query,
    { currentSlug, category, limit },
    {
      next: {
        revalidate: 3600,
        tags: ['portfolio']
      }
    }
  )
  
  return items
}

/**
 * Получить все slugs для generateStaticParams
 * 
 * @returns Promise<string[]>
 * 
 * @example
 * ```ts
 * export async function generateStaticParams() {
 *   const slugs = await getAllPortfolioSlugs()
 *   return slugs.map((slug) => ({ slug }))
 * }
 * ```
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


