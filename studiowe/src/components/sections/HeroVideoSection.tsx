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
  const videoRef = useRef<HTMLVideoElement>(null)
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
        threshold: 0.9, // Запускаем когда 80% секции в viewport (практически зафиксирована)
      }
    )

    observer.observe(sectionRef.current)

    return () => {
      if (sectionRef.current) {
        observer.unobserve(sectionRef.current)
      }
    }
  }, [autoplay])

  // Программное управление воспроизведением (исправляет проблему с автоплеем)
  useEffect(() => {
    const video = videoRef.current
    if (!video || !autoplay) return

    if (isInView) {
      const playVideo = async () => {
        try {
          // Пытаемся запустить видео
          // Важно: если muted=false, браузер может заблокировать (NotAllowedError)
          await video.play()
        } catch (error) {
          console.warn('Autoplay with sound prevented by browser policy. Retrying muted...', error)
          
          // Если заблокировано, пробуем запустить без звука (стандартное поведение для Hero видео)
          if (!video.muted) {
            video.muted = true
            try {
              await video.play()
            } catch (retryError) {
              console.error('Muted autoplay also failed:', retryError)
            }
          }
        }
      }
      
      playVideo()
    } else {
      // Ставим на паузу, чтобы не грузить процессор
      video.pause()
    }
  }, [isInView, autoplay])

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
      {/* Контейнер с ограниченной шириной для эффекта "вписанности" как в Antigravity */}
      <div className="w-full max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Заголовок (опционально) */}
        {title && (
          <div className="mb-6 text-center">
            <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              {title}
            </h2>
          </div>
        )}

        {/* Видео контейнер с рамкой и тенью */}
        <div 
          className={cn(
            'relative w-full overflow-hidden bg-black',
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
            ref={videoRef}
            src={videoUrl}
            poster={posterUrl}
            muted={muted}
            loop={loop}
            preload="auto"
            controls={!autoplay}
            playsInline
            className="w-full h-full object-contain md:object-cover"
            aria-label={title || 'Hero Video'}
          />

          {/* Тонкая внутренняя рамка для глубины */}
          <div className="absolute inset-0 rounded-2xl md:rounded-3xl ring-1 ring-inset ring-white/10 pointer-events-none" />
        </div>

        {/* Декоративный элемент - свечение снизу */}
        <div className="absolute -bottom-12 left-1/2 -translate-x-1/2 w-3/4 h-24 bg-gradient-to-t from-blue-500/20 via-purple-500/10 to-transparent blur-3xl pointer-events-none -z-10" />
      </div>
    </section>
  )
}

