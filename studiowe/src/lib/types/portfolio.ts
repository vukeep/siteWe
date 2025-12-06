/**
 * Типы для портфолио
 * 
 * Используются для типизации данных портфолио из CMS
 * и для mock данных на этапе разработки
 */

export type PortfolioCategory =
  | 'marketing'
  | 'ecommerce'
  | 'education'
  | 'brand'
  | 'ai-characters'
  | 'series'

export interface PortfolioItem {
  /** Уникальный ID */
  id: string
  
  /** Slug для URL */
  slug: string
  
  /** Название проекта */
  title: string
  
  /** Краткое описание */
  description: string
  
  /** Категория */
  category: PortfolioCategory
  
  /** URL видео в Cloudinary */
  videoUrl: string
  
  /** URL постера/превью */
  posterUrl: string
  
  /** Длительность видео (в секундах) */
  duration: number
  
  /** Теги для поиска и фильтрации */
  tags: string[]
  
  /** Дата публикации */
  publishedAt: Date
  
  /** Избранное (показывать на главной) */
  featured: boolean
  
  /** Количество просмотров (опционально) */
  viewCount?: number
}

export interface PortfolioFilters {
  category?: PortfolioCategory
  tags?: string[]
  featured?: boolean
}

