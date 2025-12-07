import { MetadataRoute } from 'next'
import { getPortfolioItems } from '@/lib/sanity/queries'

/**
 * Sitemap generator для StudioWe
 * 
 * Генерирует sitemap.xml для SEO оптимизации из данных Sanity CMS.
 * Включает:
 * - Главную страницу
 * - Страницу портфолио
 * - Детальные страницы всех проектов
 * 
 * Автоматически обновляется при изменении контента через ISR.
 */
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://studiowe.com'

  // Основные страницы
  const routes = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 1.0,
    },
    {
      url: `${baseUrl}/portfolio`,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.9,
    },
  ]

  // Страницы портфолио из Sanity CMS
  const portfolioItems = await getPortfolioItems()
  const portfolioRoutes = portfolioItems.map((item) => ({
    url: `${baseUrl}/portfolio/${item.slug}`,
    lastModified: new Date(item.publishedAt),
    changeFrequency: 'monthly' as const,
    priority: 0.8,
  }))

  return [...routes, ...portfolioRoutes]
}

