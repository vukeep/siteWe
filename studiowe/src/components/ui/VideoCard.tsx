'use client'

import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import type { PortfolioItem } from '@/lib/types/portfolio'

/**
 * VideoCard компонент
 * 
 * Отображает превью видео с постером.
 * Клик на видео открывает модальное окно с video player.
 * Клик на название ведет на детальную страницу проекта.
 * Кнопка "Хочу также" открывает форму заявки.
 * 
 * Features:
 * - Lazy loading изображений (кроме первого с priority)
 * - Клик на видео → модальное окно с воспроизведением
 * - Клик на название → переход на /portfolio/{slug}
 * - Отображение метаданных (категория, длительность)
 * - Hover эффект с анимацией play иконки
 * - CTA кнопка для формы заявки
 */

interface VideoCardProps {
  item: PortfolioItem
  onCTAClick?: (item: PortfolioItem) => void
  onVideoClick?: (item: PortfolioItem) => void // Колбэк для открытия видео в модальном окне
  variant?: 'grid' | 'horizontal' // Вариант отображения
  priority?: boolean // Для LCP оптимизации первого элемента
}

export function VideoCard({ item, onCTAClick, onVideoClick, variant = 'horizontal', priority = false }: VideoCardProps) {
  const [isHovered, setIsHovered] = useState(false)

  // Обработчик клика на видео
  const handleVideoClick = (e: React.MouseEvent) => {
    e.preventDefault() // Предотвращаем переход по ссылке
    onVideoClick?.(item)
  }

  const categoryLabels: Record<string, string> = {
    marketing: 'Маркетинг',
    ecommerce: 'E-commerce',
    education: 'Обучение',
    brand: 'Бренд',
    'ai-characters': 'AI-персонажи',
    series: 'Серии',
  }

  const formatDuration = (seconds: number) => {
    if (seconds < 60) {
      return `${seconds}сек`
    }
    const minutes = Math.floor(seconds / 60)
    const remainingSeconds = seconds % 60
    return remainingSeconds > 0 ? `${minutes}м ${remainingSeconds}с` : `${minutes}м`
  }

  // Разные стили для grid и horizontal вариантов
  const containerClasses = variant === 'horizontal'
    ? 'group relative flex-shrink-0 w-64 sm:w-72 md:w-80 rounded-2xl overflow-hidden card-shadow hover:card-shadow-lg transition-all duration-300 hover:-translate-y-1'
    : 'group relative w-full rounded-2xl overflow-hidden card-shadow hover:card-shadow-lg transition-all duration-300 hover:-translate-y-1'

  return (
    <div
      className={containerClasses}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Превью изображения - кликабельное для открытия видео в модальном окне */}
      <div 
        onClick={handleVideoClick}
        className="relative aspect-[9/16] bg-neutral-900 block cursor-pointer"
      >
        <Image
          src={item.posterUrl}
          alt={item.title}
          fill
          className="object-cover"
          sizes="(max-width: 640px) 256px, (max-width: 768px) 288px, 320px"
          priority={priority}
        />

        {/* Оверлей с play иконкой */}
        <div className={`absolute inset-0 bg-black/40 flex items-center justify-center transition-opacity duration-300 ${isHovered ? 'opacity-100' : 'opacity-0'}`}>
          <div className="w-16 h-16 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center group-hover:scale-110 transition-transform">
            <svg className="w-8 h-8 text-white ml-1" fill="currentColor" viewBox="0 0 24 24">
              <path d="M8 5v14l11-7z" />
            </svg>
          </div>
        </div>

        {/* Метаданные поверх видео */}
        <div className="absolute top-4 left-4 right-4 flex justify-between items-start pointer-events-none">
          <span className="px-3 py-1 bg-black/60 backdrop-blur-sm text-white text-xs font-medium rounded-full">
            {categoryLabels[item.category]}
          </span>
          <span className="px-3 py-1 bg-black/60 backdrop-blur-sm text-white text-xs font-medium rounded-full">
            {formatDuration(item.duration)}
          </span>
        </div>
      </div>

      {/* Информация о видео */}
      <div className="p-4 bg-white">
        <Link href={`/portfolio/${item.slug}`}>
          <h3 className="text-lg font-bold text-neutral-900 mb-2 line-clamp-2 hover:text-blue-600 transition-colors cursor-pointer">
            {item.title}
          </h3>
        </Link>
        <p className="text-sm text-neutral-600 mb-4 line-clamp-2">
          {item.description}
        </p>

        {/* Теги */}
        <div className="flex flex-wrap gap-2 mb-4">
          {item.tags.slice(0, 3).map((tag, index) => (
            <span
              key={index}
              className="px-2 py-1 bg-neutral-100 text-neutral-700 text-xs rounded"
            >
              {tag}
            </span>
          ))}
        </div>

        {/* CTA кнопка */}
        <button
          onClick={() => onCTAClick?.(item)}
          className="w-full px-4 py-2 bg-button hover:bg-button-hover text-white rounded-lg font-medium text-sm transition-colors"
        >
          Хочу также
        </button>
      </div>
    </div>
  )
}

