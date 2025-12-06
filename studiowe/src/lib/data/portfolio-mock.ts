import { PortfolioItem } from '../types/portfolio'

/**
 * Mock данные для портфолио
 * 
 * Используются на этапе разработки до интеграции с Payload CMS
 * Содержат placeholder URL для видео из Unsplash/Pexels
 * 
 * В production эти данные будут загружаться из CMS
 */

export const portfolioMockData: PortfolioItem[] = [
  {
    id: '1',
    slug: 'marketing-campaign-tech',
    title: 'Рекламная кампания для Tech стартапа',
    description: 'Серия из 10 роликов для продвижения нового SaaS продукта в соцсетях',
    category: 'marketing',
    videoUrl: 'https://res.cloudinary.com/demo/video/upload/docs/coffee.mp4', // Demo video
    posterUrl: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=400',
    duration: 15,
    tags: ['реклама', 'tech', 'социальные сети'],
    publishedAt: new Date('2024-01-15'),
    featured: true,
    viewCount: 1250,
  },
  {
    id: '2',
    slug: 'ecommerce-product-showcase',
    title: 'Презентация товаров для E-commerce',
    description: 'AI-персонаж демонстрирует преимущества продуктов в вертикальном формате',
    category: 'ecommerce',
    videoUrl: 'https://res.cloudinary.com/demo/video/upload/docs/coffee.mp4',
    posterUrl: 'https://images.unsplash.com/photo-1472851294608-062f824d29cc?w=400',
    duration: 30,
    tags: ['e-commerce', 'продукты', 'вертикальное видео'],
    publishedAt: new Date('2024-01-20'),
    featured: true,
    viewCount: 980,
  },
  {
    id: '3',
    slug: 'corporate-onboarding',
    title: 'Онбординг для новых сотрудников',
    description: 'Серия обучающих роликов для адаптации персонала в компании',
    category: 'education',
    videoUrl: 'https://res.cloudinary.com/demo/video/upload/docs/coffee.mp4',
    posterUrl: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=400',
    duration: 45,
    tags: ['HR', 'обучение', 'корпоративное'],
    publishedAt: new Date('2024-01-25'),
    featured: false,
    viewCount: 750,
  },
  {
    id: '4',
    slug: 'brand-image-video',
    title: 'Имиджевый ролик для премиум бренда',
    description: 'Эмоциональное видео с AI-персонажами для усиления бренда',
    category: 'brand',
    videoUrl: 'https://res.cloudinary.com/demo/video/upload/docs/coffee.mp4',
    posterUrl: 'https://images.unsplash.com/photo-1556742502-ec7c0e9f34b1?w=400',
    duration: 60,
    tags: ['бренд', 'имидж', 'премиум'],
    publishedAt: new Date('2024-02-01'),
    featured: true,
    viewCount: 1500,
  },
  {
    id: '5',
    slug: 'ai-character-influencer',
    title: 'Виртуальный инфлюенсер для соцсетей',
    description: 'AI-персонаж ведет видеоблог о продукте компании',
    category: 'ai-characters',
    videoUrl: 'https://res.cloudinary.com/demo/video/upload/docs/coffee.mp4',
    posterUrl: 'https://images.unsplash.com/photo-1535378917042-10a22c95931a?w=400',
    duration: 20,
    tags: ['AI', 'инфлюенсер', 'соцсети'],
    publishedAt: new Date('2024-02-05'),
    featured: true,
    viewCount: 2100,
  },
  {
    id: '6',
    slug: 'content-series-50',
    title: 'Контент-сетка 50 роликов',
    description: 'Масштабная серия видео для ежедневных публикаций в течение 2 месяцев',
    category: 'series',
    videoUrl: 'https://res.cloudinary.com/demo/video/upload/docs/coffee.mp4',
    posterUrl: 'https://images.unsplash.com/photo-1533158326339-7f3cf2404354?w=400',
    duration: 15,
    tags: ['серия', 'контент-план', 'масштаб'],
    publishedAt: new Date('2024-02-10'),
    featured: false,
    viewCount: 890,
  },
  {
    id: '7',
    slug: 'social-ads-campaign',
    title: 'Performance-креативы для Facebook Ads',
    description: '20 вариаций рекламных роликов для A/B тестирования',
    category: 'marketing',
    videoUrl: 'https://res.cloudinary.com/demo/video/upload/docs/coffee.mp4',
    posterUrl: 'https://images.unsplash.com/photo-1432888498266-38ffec3eaf0a?w=400',
    duration: 10,
    tags: ['реклама', 'performance', 'A/B тест'],
    publishedAt: new Date('2024-02-15'),
    featured: false,
    viewCount: 1120,
  },
  {
    id: '8',
    slug: 'training-module-series',
    title: 'Модули обучения для сотрудников',
    description: 'Инструкции и обучающие ролики для внутреннего использования',
    category: 'education',
    videoUrl: 'https://res.cloudinary.com/demo/video/upload/docs/coffee.mp4',
    posterUrl: 'https://images.unsplash.com/photo-1524178232363-1fb2b075b655?w=400',
    duration: 90,
    tags: ['обучение', 'тренинг', 'инструкции'],
    publishedAt: new Date('2024-02-20'),
    featured: false,
    viewCount: 650,
  },
]

/**
 * Получить портфолио с фильтрацией
 */
export function getPortfolioItems(filters?: {
  category?: string
  featured?: boolean
  limit?: number
}) {
  let items = [...portfolioMockData]

  if (filters?.category) {
    items = items.filter((item) => item.category === filters.category)
  }

  if (filters?.featured !== undefined) {
    items = items.filter((item) => item.featured === filters.featured)
  }

  if (filters?.limit) {
    items = items.slice(0, filters.limit)
  }

  return items
}

/**
 * Получить элемент портфолио по slug
 */
export function getPortfolioItemBySlug(slug: string) {
  return portfolioMockData.find((item) => item.slug === slug)
}

/**
 * Получить связанные проекты
 */
export function getRelatedProjects(currentSlug: string, limit: number = 3) {
  const currentItem = getPortfolioItemBySlug(currentSlug)
  if (!currentItem) return []

  return portfolioMockData
    .filter(
      (item) =>
        item.slug !== currentSlug &&
        item.category === currentItem.category
    )
    .slice(0, limit)
}

