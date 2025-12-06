'use client'

import { useState } from 'react'
import Image from 'next/image'
import type { PortfolioItem } from '@/lib/types/portfolio'

/**
 * VideoCard компонент
 * 
 * Отображает превью видео с постером
 * При наведении/клике показывает video с автопроигрыванием
 * 
 * Features:
 * - Lazy loading изображений
 * - Отображение метаданных (категория, длительность)
 * - Hover эффект с анимацией
 * - Оверлей с play иконкой
 */

interface VideoCardProps {
  item: PortfolioItem
  onCTAClick?: (item: PortfolioItem) => void
  variant?: 'grid' | 'horizontal' // Вариант отображения
}

export function VideoCard({ item, onCTAClick, variant = 'horizontal' }: VideoCardProps) {
  const [isHovered, setIsHovered] = useState(false)

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
      {/* Превью изображения */}
      <div className="relative aspect-[9/16] bg-neutral-900">
        <Image
          src={item.posterUrl}
          alt={item.title}
          fill
          className="object-cover"
          sizes="(max-width: 640px) 256px, (max-width: 768px) 288px, 320px"
        />

        {/* Оверлей с play иконкой */}
        <div className={`absolute inset-0 bg-black/40 flex items-center justify-center transition-opacity duration-300 ${isHovered ? 'opacity-100' : 'opacity-0'}`}>
          <div className="w-16 h-16 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
            <svg className="w-8 h-8 text-white ml-1" fill="currentColor" viewBox="0 0 24 24">
              <path d="M8 5v14l11-7z" />
            </svg>
          </div>
        </div>

        {/* Метаданные поверх видео */}
        <div className="absolute top-4 left-4 right-4 flex justify-between items-start">
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
        <h3 className="text-lg font-bold text-neutral-900 mb-2 line-clamp-2">
          {item.title}
        </h3>
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
          className="w-full px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium text-sm transition-colors"
        >
          Хочу также
        </button>
      </div>
    </div>
  )
}

