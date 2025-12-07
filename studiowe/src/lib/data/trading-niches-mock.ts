/**
 * Mock данные для торговых ниш
 * 
 * Начальные данные для блока "Какие ролики мы создаем"
 * Используются для первоначального заполнения Sanity CMS
 */

export interface TradingNicheMock {
  title: string
  icon: string
  slug: string
  description: string
  order: number
  subcategories: string[]
  mediaType: 'video' | 'image'
  cloudinaryBaseUrl: string
  videoAutoplay?: boolean
  videoLoop?: boolean
  videoMuted?: boolean
  published: boolean
}

export const tradingNichesMockData: TradingNicheMock[] = [
  {
    title: 'Маркетинг и продажи',
    icon: '📈',
    slug: 'marketing-i-prodazhi',
    description: 'Видео, которые продают и привлекают клиентов',
    order: 1,
    subcategories: [
      'Рекламные ролики для соцсетей',
      'Performance-креативы',
      'Промо и акции',
      'Объясняющие видео',
    ],
    mediaType: 'image',
    cloudinaryBaseUrl: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&h=600&fit=crop',
    published: true
  },
  {
    title: 'E-commerce',
    icon: '🛒',
    slug: 'e-commerce',
    description: 'Увеличьте конверсию в продажах',
    order: 2,
    subcategories: [
      'Видео-карточки товаров',
      'Обзоры и демонстрации продуктов',
    ],
    mediaType: 'image',
    cloudinaryBaseUrl: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=800&h=600&fit=crop',
    published: true
  },
  {
    title: 'Обучение и HR',
    icon: '🎓',
    slug: 'obuchenie-i-hr',
    description: 'Эффективное обучение сотрудников',
    order: 3,
    subcategories: [
      'Онбординг',
      'Инструкции и обучающие ролики',
      'Внутренние коммуникации',
    ],
    mediaType: 'image',
    cloudinaryBaseUrl: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800&h=600&fit=crop',
    published: true
  },
  {
    title: 'Бренд-контент',
    icon: '✨',
    slug: 'brand-kontent',
    description: 'Создайте узнаваемый образ бренда',
    order: 4,
    subcategories: [
      'Имиджевые ролики',
      'Видео для событий и презентаций',
      'HR-бренд',
    ],
    mediaType: 'image',
    cloudinaryBaseUrl: 'https://images.unsplash.com/photo-1558655146-d09347e92766?w=800&h=600&fit=crop',
    published: true
  },
  {
    title: 'AI-персонажи',
    icon: '🤖',
    slug: 'ai-personazhi',
    description: 'Инновационный подход с AI-технологиями',
    order: 5,
    subcategories: [
      'Ролики с цифровыми актерами',
      'Виртуальные ведущие и инфлюенсеры',
    ],
    mediaType: 'image',
    cloudinaryBaseUrl: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=800&h=600&fit=crop',
    published: true
  },
  {
    title: 'Серии роликов',
    icon: '🎬',
    slug: 'serii-rolikov',
    description: 'Масштабное производство контента',
    order: 6,
    subcategories: [
      'Пакеты 10/30/50/100+ для кампаний',
      'Контент-сетки для соцсетей',
    ],
    mediaType: 'image',
    cloudinaryBaseUrl: 'https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?w=800&h=600&fit=crop',
    published: true
  },
]

