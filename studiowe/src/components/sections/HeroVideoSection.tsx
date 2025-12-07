/**
 * Hero Video Section
 * 
 * Полноэкранный видеоплеер на всю ширину экрана
 * Управляется через Sanity CMS
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
        'snap-section relative w-full min-h-screen flex items-center justify-center bg-black overflow-hidden',
        className
      )}
    >
      {/* Заголовок (опционально) */}
      {title && (
        <div className="absolute top-0 left-0 right-0 z-10 pt-32 pb-8 bg-gradient-to-b from-black/80 to-transparent">
          <div className="container-custom">
            <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-white text-center">
              {title}
            </h2>
          </div>
        </div>
      )}

      {/* Видеоплеер на всю ширину */}
      <div className="relative w-full h-screen">
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

        {/* Градиент снизу для плавного перехода */}
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-white to-transparent pointer-events-none" />
      </div>

      {/* Индикатор прокрутки */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 animate-bounce">
        <div className="w-6 h-10 border-2 border-white/50 rounded-full flex items-start justify-center p-2">
          <div className="w-1 h-3 bg-white/50 rounded-full animate-pulse" />
        </div>
      </div>
    </section>
  )
}

