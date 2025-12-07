'use client'

import { useState, useRef, useEffect } from 'react'
import Image from 'next/image'

/**
 * VideoPlayer компонент
 * 
 * Полноценный video player с:
 * - Постером (poster)
 * - Play/Pause управлением
 * - Автопроигрыванием при клике
 * - Автоопределением ориентации видео (вертикальное/горизонтальное)
 * - Оптимизацией загрузки
 * 
 * Производительность:
 * - Видео загружается только при клике (lazy loading)
 * - Постер оптимизирован через Next.js Image
 * - Автоматическое определение aspect ratio из метаданных видео
 */

interface VideoPlayerProps {
  videoUrl: string
  posterUrl: string
  title: string
  autoplay?: boolean
  muted?: boolean
  loop?: boolean
  controls?: boolean
  priority?: boolean // Для LCP оптимизации
  className?: string
  aspectRatio?: 'video' | '9/16' | 'auto' // aspect-video, aspect-[9/16] или auto-detect
  onAspectRatioDetected?: (isVertical: boolean, ratio: number) => void
}

export function VideoPlayer({
  videoUrl,
  posterUrl,
  title,
  autoplay = false,
  muted = false, // Звук включен по умолчанию
  loop = false,
  controls = true,
  priority = false,
  className = '',
  aspectRatio = 'auto',
  onAspectRatioDetected
}: VideoPlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false)
  const [showVideo, setShowVideo] = useState(false)
  const [detectedAspectRatio, setDetectedAspectRatio] = useState<'vertical' | 'horizontal' | 'square' | null>(null)
  const [videoDimensions, setVideoDimensions] = useState<{ width: number; height: number } | null>(null)
  const videoRef = useRef<HTMLVideoElement>(null)

  // Обработчик клика на play кнопку
  const handlePlayClick = () => {
    setShowVideo(true)
    setIsPlaying(true)
  }

  // Определение размеров и ориентации видео из метаданных
  const handleLoadedMetadata = () => {
    if (videoRef.current) {
      const width = videoRef.current.videoWidth
      const height = videoRef.current.videoHeight
      const ratio = width / height

      setVideoDimensions({ width, height })

      // Определяем ориентацию
      let orientation: 'vertical' | 'horizontal' | 'square'
      if (ratio < 0.9) {
        orientation = 'vertical' // Вертикальное (9:16, 4:5)
      } else if (ratio > 1.1) {
        orientation = 'horizontal' // Горизонтальное (16:9, 21:9)
      } else {
        orientation = 'square' // Квадратное (1:1)
      }

      setDetectedAspectRatio(orientation)
      
      // Колбэк для родительского компонента
      onAspectRatioDetected?.(orientation === 'vertical', ratio)

      console.log(`📹 Видео метаданные:`, {
        width,
        height,
        ratio: ratio.toFixed(2),
        orientation
      })
    }
  }

  // Автоматически запускаем видео после загрузки
  useEffect(() => {
    if (showVideo && videoRef.current) {
      videoRef.current.play().catch(error => {
        console.error('Ошибка воспроизведения видео:', error)
      })
    }
  }, [showVideo])

  // Обработчики событий видео
  const handlePlay = () => setIsPlaying(true)
  const handlePause = () => setIsPlaying(false)
  const handleEnded = () => setIsPlaying(false)

  // Определяем класс aspect ratio
  const getAspectClass = () => {
    if (aspectRatio === 'auto' && detectedAspectRatio) {
      switch (detectedAspectRatio) {
        case 'vertical':
          return 'aspect-[9/16]'
        case 'horizontal':
          return 'aspect-video'
        case 'square':
          return 'aspect-square'
      }
    }
    return aspectRatio === 'video' ? 'aspect-video' : 'aspect-[9/16]'
  }

  const aspectClass = getAspectClass()

  return (
    <div className={`relative ${aspectClass} bg-neutral-900 rounded-2xl overflow-hidden max-h-[inherit] ${className}`}>
      {/* Постер (показывается пока видео не загружено) */}
      {!showVideo && (
        <>
          <Image
            src={posterUrl}
            alt={title}
            fill
            className="object-contain"
            priority={priority}
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 1200px"
          />
          
          {/* Play кнопка */}
          <div className="absolute inset-0 flex items-center justify-center bg-black/40">
            <button
              onClick={handlePlayClick}
              className="w-20 h-20 rounded-full bg-white/90 hover:bg-white flex items-center justify-center transition-all hover:scale-110 group"
              aria-label="Воспроизвести видео"
            >
              <svg 
                className="w-10 h-10 text-blue-600 ml-1 group-hover:scale-110 transition-transform" 
                fill="currentColor" 
                viewBox="0 0 24 24"
              >
                <path d="M8 5v14l11-7z" />
              </svg>
            </button>
          </div>
        </>
      )}

      {/* Видео (загружается только после клика) */}
      {showVideo && (
        <video
          ref={videoRef}
          src={videoUrl}
          poster={posterUrl}
          className="w-full h-auto max-h-[80vh] object-contain bg-black"
          style={{ maxHeight: 'inherit' }}
          autoPlay={autoplay}
          muted={muted}
          loop={loop}
          controls={controls}
          playsInline
          preload="metadata"
          onLoadedMetadata={handleLoadedMetadata}
          onPlay={handlePlay}
          onPause={handlePause}
          onEnded={handleEnded}
        >
          <source src={videoUrl} type="video/mp4" />
          Ваш браузер не поддерживает воспроизведение видео.
        </video>
      )}
    </div>
  )
}

