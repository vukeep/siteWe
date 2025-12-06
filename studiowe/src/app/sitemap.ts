import { MetadataRoute } from 'next'
import { getPortfolioItems } from '@/lib/data/portfolio-mock'

/**
 * Sitemap generator для StudioWe
 * 
 * Генерирует sitemap.xml для SEO оптимизации
 * Включает:
 * - Главную страницу
 * - Страницу портфолио
 * - Детальные страницы проектов (для будущего)
 * 
 * Автоматически обновляется при изменении контента
 */
export default function sitemap(): MetadataRoute.Sitemap {
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

  // Страницы портфолио (для будущего использования)
  const portfolioItems = getPortfolioItems()
  const portfolioRoutes = portfolioItems.map((item) => ({
    url: `${baseUrl}/portfolio/${item.slug}`,
    lastModified: item.publishedAt,
    changeFrequency: 'monthly' as const,
    priority: 0.8,
  }))

  return [...routes, ...portfolioRoutes]
}

