'use client'

import { useState, useRef } from 'react'
import { VideoCard } from '@/components/ui/VideoCard'
import { LeadForm } from '@/components/forms/LeadForm'
import { getPortfolioItems } from '@/lib/data/portfolio-mock'
import type { PortfolioItem } from '@/lib/types/portfolio'

/**
 * Video Gallery Section - Горизонтальная галерея портфолио
 * 
 * Отображает избранные видео из портфолио в виде
 * горизонтально прокручиваемой ленты
 * 
 * Features:
 * - Горизонтальный скролл с кнопками навигации
 * - Модальное окно с формой при клике на "Хочу также"
 * - Lazy loading видео
 * - Адаптивная верстка
 */

export function VideoGallerySection() {
  const [selectedVideo, setSelectedVideo] = useState<PortfolioItem | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const scrollContainerRef = useRef<HTMLDivElement>(null)

  // Получить только избранные видео
  const featuredVideos = getPortfolioItems({ featured: true, limit: 8 })

  const handleCTAClick = (item: PortfolioItem) => {
    setSelectedVideo(item)
    setIsModalOpen(true)
  }

  const handleCloseModal = () => {
    setIsModalOpen(false)
    setTimeout(() => setSelectedVideo(null), 300) // Задержка для анимации
  }

  const handleFormSuccess = () => {
    // Закрыть модальное окно через 2 секунды после успешной отправки
    setTimeout(() => {
      handleCloseModal()
    }, 2000)
  }

  const scroll = (direction: 'left' | 'right') => {
    if (!scrollContainerRef.current) return
    
    const scrollAmount = 350
    const newScrollLeft =
      scrollContainerRef.current.scrollLeft +
      (direction === 'left' ? -scrollAmount : scrollAmount)
    
    scrollContainerRef.current.scrollTo({
      left: newScrollLeft,
      behavior: 'smooth',
    })
  }

  return (
    <>
      <section id="portfolio" className="py-20 lg:py-32 bg-neutral-50">
        <div className="container-custom">
          {/* Заголовок секции */}
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-4 text-neutral-900">
              Наши работы
            </h2>
            <p className="text-lg md:text-xl text-neutral-600 max-w-3xl mx-auto">
              Примеры AI-роликов, созданных для различных бизнесов
            </p>
          </div>

          {/* Горизонтальная галерея */}
          <div className="relative">
            {/* Кнопка прокрутки влево */}
            <button
              onClick={() => scroll('left')}
              className="absolute left-0 top-1/2 -translate-y-1/2 z-10 w-12 h-12 bg-white/90 hover:bg-white shadow-lg rounded-full flex items-center justify-center transition-all duration-300 hover:scale-110 hidden md:flex"
              aria-label="Прокрутить влево"
            >
              <svg className="w-6 h-6 text-neutral-800" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>

            {/* Контейнер с видео */}
            <div
              ref={scrollContainerRef}
              className="flex gap-6 overflow-x-auto scrollbar-hide scroll-smooth px-4 md:px-12 py-4"
              style={{
                scrollbarWidth: 'none',
                msOverflowStyle: 'none',
              }}
            >
              {featuredVideos.map((item) => (
                <VideoCard
                  key={item.id}
                  item={item}
                  onCTAClick={handleCTAClick}
                />
              ))}
            </div>

            {/* Кнопка прокрутки вправо */}
            <button
              onClick={() => scroll('right')}
              className="absolute right-0 top-1/2 -translate-y-1/2 z-10 w-12 h-12 bg-white/90 hover:bg-white shadow-lg rounded-full flex items-center justify-center transition-all duration-300 hover:scale-110 hidden md:flex"
              aria-label="Прокрутить вправо"
            >
              <svg className="w-6 h-6 text-neutral-800" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>

          {/* CTA для просмотра всего портфолио */}
          <div className="text-center mt-12">
            <a
              href="/portfolio"
              className="inline-block px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold text-lg transition-all duration-300 shadow-lg hover:shadow-xl"
            >
              Посмотреть все работы
            </a>
          </div>
        </div>
      </section>

      {/* Модальное окно с формой */}
      {isModalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
          onClick={handleCloseModal}
        >
          <div
            className="bg-white rounded-2xl p-6 md:p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Заголовок */}
            <div className="flex justify-between items-start mb-6">
              <div>
                <h3 className="text-2xl md:text-3xl font-bold text-neutral-900 mb-2">
                  Хотите такой же ролик?
                </h3>
                {selectedVideo && (
                  <p className="text-neutral-600">
                    Вы выбрали: <span className="font-medium">{selectedVideo.title}</span>
                  </p>
                )}
              </div>
              <button
                onClick={handleCloseModal}
                className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-neutral-100 transition-colors"
                aria-label="Закрыть"
              >
                <svg className="w-6 h-6 text-neutral-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Форма */}
            <LeadForm
              requestType="portfolio_request"
              onSuccess={handleFormSuccess}
            />
          </div>
        </div>
      )}
    </>
  )
}

