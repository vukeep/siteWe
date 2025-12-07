'use client'

import { useEffect, useState, useRef } from 'react'
import { VideoPlayer } from './VideoPlayer'
import type { PortfolioItem } from '@/lib/types/portfolio'

/**
 * VideoModal компонент
 * 
 * Современное модальное окно для воспроизведения видео с:
 * - Адаптивными размерами (70% desktop, 90% mobile)
 * - Свайпом вниз для закрытия на мобильных
 * - Плавными анимациями
 * - Автоопределением ориентации видео
 * - Swipe indicator
 * 
 * Best practices от Cloudinary + Netflix/YouTube UX
 */

interface VideoModalProps {
  video: PortfolioItem | null
  isOpen: boolean
  onClose: () => void
}

export function VideoModal({ video, isOpen, onClose }: VideoModalProps) {
  const [videoOrientation, setVideoOrientation] = useState<'vertical' | 'horizontal' | null>(null)
  const [touchStart, setTouchStart] = useState(0)
  const [touchCurrent, setTouchCurrent] = useState(0)
  const [isDragging, setIsDragging] = useState(false)
  const modalRef = useRef<HTMLDivElement>(null)

  // Обработчик определения ориентации видео
  const handleAspectRatioDetected = (isVertical: boolean) => {
    setVideoOrientation(isVertical ? 'vertical' : 'horizontal')
  }

  // Touch handlers для свайпа
  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStart(e.touches[0].clientY)
    setTouchCurrent(e.touches[0].clientY)
    setIsDragging(true)
  }

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging) return
    setTouchCurrent(e.touches[0].clientY)
  }

  const handleTouchEnd = () => {
    if (!isDragging) return
    
    const swipeDistance = touchCurrent - touchStart
    
    // Свайп вниз больше 100px → закрыть
    if (swipeDistance > 100) {
      onClose()
    }
    
    setIsDragging(false)
    setTouchStart(0)
    setTouchCurrent(0)
  }

  // Вычисляем transform для visual feedback при свайпе
  const getDragTransform = () => {
    if (!isDragging) return 'translateY(0)'
    const distance = Math.max(0, touchCurrent - touchStart)
    return `translateY(${distance}px)`
  }

  // Вычисляем opacity для visual feedback
  const getDragOpacity = () => {
    if (!isDragging) return 1
    const distance = Math.max(0, touchCurrent - touchStart)
    return Math.max(0.5, 1 - distance / 400)
  }

  // Закрытие по ESC
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose()
      }
    }

    document.addEventListener('keydown', handleEscape)
    return () => document.removeEventListener('keydown', handleEscape)
  }, [isOpen, onClose])

  // Блокировка скролла body когда модальное окно открыто
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => {
      document.body.style.overflow = ''
    }
  }, [isOpen])

  if (!isOpen || !video) return null

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-300"
      onClick={onClose}
    >
      {/* Модальный контейнер */}
      <div
        ref={modalRef}
        className={`
          relative w-full 
          transition-all duration-300 ease-out
          animate-in zoom-in-95 slide-in-from-bottom-4
          ${videoOrientation === 'vertical' 
            ? 'max-w-[90vw] lg:max-w-[40vw]' // Узкое для вертикальных (9:16)
            : 'max-w-[90vw] lg:max-w-[70vw]' // Широкое для горизонтальных (16:9)
          }
          max-h-[90vh] lg:max-h-[80vh]
        `}
        style={{
          transform: getDragTransform(),
          opacity: getDragOpacity(),
        }}
        onClick={(e) => e.stopPropagation()}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        {/* Swipe Indicator (только на мобильных) */}
        <div className="lg:hidden absolute -top-8 left-1/2 -translate-x-1/2 z-10">
          <div className="w-12 h-1 rounded-full bg-white/40 backdrop-blur-sm" />
        </div>

        {/* Кнопка закрытия */}
        <button
          onClick={onClose}
          className="
            absolute -top-12 right-0 z-10
            w-12 h-12 
            flex items-center justify-center 
            rounded-full 
            bg-white/10 backdrop-blur-md
            hover:bg-white/20 
            transition-all duration-200
            hover:scale-110
            focus:outline-none focus:ring-2 focus:ring-white/50
          "
          aria-label="Закрыть модальное окно"
        >
          <svg 
            className="w-6 h-6 text-white" 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth={2} 
              d="M6 18L18 6M6 6l12 12" 
            />
          </svg>
        </button>

                {/* Video Player с тенью и rounded corners */}
        <div className="rounded-2xl overflow-hidden shadow-2xl ring-1 ring-white/10 max-h-[80vh]">
          <VideoPlayer
            videoUrl={video.videoUrl}
            posterUrl={video.posterUrl}
            title={video.title}
            priority
            controls
            autoplay
            muted={false}
            className="w-full max-h-[80vh]"
            aspectRatio="auto"
            onAspectRatioDetected={handleAspectRatioDetected}
          />
        </div>
      </div>
    </div>
  )
}

