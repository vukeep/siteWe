/**
 * Hero Video Section
 * 
 * Стильный видеоплеер с современным дизайном:
 * - Закругленные углы (rounded-3xl)
 * - Объемная тень (shadow-2xl)
 * - Соотношение сторон 16:9
 * - Градиентный фон
 * - Hover эффект с масштабированием
 * - Декоративное свечение
 * 
 * Управляется через Sanity CMS
 * Производительность: Intersection Observer для autoplay
 */

'use client'

import { useEffect, useRef, useState } from 'react'
import { VideoPlayer } from '@/components/ui/VideoPlayer'
import { cn } from '@/lib/utils'

interface HeroVideoSectionProps {
  title?: string
  videoUrl: string
  posterUrl: string
  autoplay?: boolean
  muted?: boolean
  loop?: boolean
  className?: string
}

export function HeroVideoSection({
  title,
  videoUrl,
  posterUrl,
  autoplay = true,
  muted = true,
  loop = false,
  className
}: HeroVideoSectionProps) {
  const sectionRef = useRef<HTMLElement>(null)
  const [isInView, setIsInView] = useState(false)

  // Intersection Observer для autoplay при появлении в viewport
  useEffect(() => {
    if (!sectionRef.current || !autoplay) return

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          setIsInView(entry.isIntersecting)
        })
      },
      {
        threshold: 0.5, // Запускаем когда 50% видео в viewport
      }
    )

    observer.observe(sectionRef.current)

    return () => {
      if (sectionRef.current) {
        observer.unobserve(sectionRef.current)
      }
    }
  }, [autoplay])

  return (
    <section
      ref={sectionRef}
      className={cn(
        'snap-section relative w-full min-h-screen flex items-center justify-center',
        // Современный градиентный фон
        'bg-gradient-to-br from-gray-50 via-white to-gray-100',
        className
      )}
    >
      {/* Минимальные отступы только для видимости тени (8px) */}
      <div className="w-full px-2 py-2">
        {/* Заголовок (опционально) */}
        {title && (
          <div className="mb-3 text-center px-2">
            <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              {title}
            </h2>
          </div>
        )}

        {/* Видео контейнер с рамкой и тенью */}
        <div 
          className={cn(
            'relative w-full overflow-hidden',
            // Красивая рамка и тень как в Google Antigravity
            'rounded-2xl md:rounded-3xl',
            'shadow-2xl shadow-gray-400/50',
            // Легкая анимация при наведении для интерактивности
            'transition-all duration-500 hover:shadow-3xl hover:shadow-gray-500/60 hover:scale-[1.01]',
            // Соотношение сторон 16:9 для видео
            'aspect-video'
          )}
        >
          <video
            src={videoUrl}
            poster={posterUrl}
            autoPlay={autoplay && isInView}
            muted={muted}
            loop={loop}
            controls={!autoplay}
            playsInline
            className="w-full h-full object-cover"
            aria-label={title || 'Hero Video'}
          />

          {/* Тонкая внутренняя рамка для глубины */}
          <div className="absolute inset-0 rounded-2xl md:rounded-3xl ring-1 ring-inset ring-black/10 pointer-events-none" />
        </div>

        {/* Декоративный элемент - свечение снизу */}
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-3/4 h-16 bg-gradient-to-t from-blue-500/20 via-purple-500/10 to-transparent blur-3xl pointer-events-none -z-10" />
      </div>

      {/* Индикатор прокрутки - теперь в темном цвете */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 animate-bounce">
        <div className="w-6 h-10 border-2 border-gray-400/50 rounded-full flex items-start justify-center p-2">
          <div className="w-1 h-3 bg-gray-400/70 rounded-full animate-pulse" />
        </div>
      </div>
    </section>
  )
}

