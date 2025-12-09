/**
 * Video Gallery Client Component
 * 
 * Клиентская часть галереи портфолио с интерактивностью:
 * - Горизонтальная прокрутка с показом ВСЕХ видео из портфолио
 * - State для модального окна с видеоплеером и формой заявки
 * - Управление прокруткой (стрелки влево/вправо)
 * - Lazy loading для оптимизации производительности
 * - Priority loading только для первых 2 видео (LCP оптимизация)
 */

'use client'

import { useState, useRef } from 'react'
import { VideoCard } from '@/components/ui/VideoCard'
import { VideoModal } from '@/components/ui/VideoModal'
import { LeadForm } from '@/components/forms/LeadForm'
import type { PortfolioItem } from '@/lib/types/portfolio'

interface VideoGalleryClientProps {
  videos: PortfolioItem[]
  title?: string
}

export function VideoGalleryClient({ videos, title = "Наши работы" }: VideoGalleryClientProps) {
  const [selectedVideo, setSelectedVideo] = useState<PortfolioItem | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isVideoModalOpen, setIsVideoModalOpen] = useState(false)
  const scrollContainerRef = useRef<HTMLDivElement>(null)

  // Обработчик для CTA кнопки (форма заявки)
  const handleCTAClick = (item: PortfolioItem) => {
    setSelectedVideo(item)
    setIsModalOpen(true)
  }

  // Обработчик для клика на видео (video player modal)
  const handleVideoClick = (item: PortfolioItem) => {
    setSelectedVideo(item)
    setIsVideoModalOpen(true)
  }

  const handleCloseModal = () => {
    setIsModalOpen(false)
    setTimeout(() => setSelectedVideo(null), 300) // Задержка для анимации
  }

  const handleCloseVideoModal = () => {
    setIsVideoModalOpen(false)
    setTimeout(() => setSelectedVideo(null), 300)
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
      <section id="portfolio" className="snap-section py-20 lg:py-32 bg-background">
        <div className="container-custom">
          {/* Заголовок секции */}
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-4 text-heading">
              {title}
            </h2>
            <p className="text-lg md:text-xl text-neutral-600 max-w-3xl mx-auto">
              Все AI-ролики, созданные нами для различных бизнесов
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
              {videos.map((item, index) => (
                <VideoCard
                  key={item.id}
                  item={item}
                  onCTAClick={handleCTAClick}
                  onVideoClick={handleVideoClick}
                  priority={index === 0 || index === 1}
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

          {/* CTA для перехода на детальную страницу портфолио */}
          <div className="text-center mt-12">
            <a
              href="/portfolio"
              className="inline-block px-8 py-4 bg-button hover:bg-button-hover text-white rounded-lg font-semibold text-lg transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105 active:scale-95"
            >
              Детальное портфолио с описаниями
            </a>
          </div>
        </div>
      </section>

          {/* Модальное окно с видео player */}
          <VideoModal
            video={selectedVideo}
            isOpen={isVideoModalOpen}
            onClose={handleCloseVideoModal}
          />

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
                    <h3 className="text-2xl md:text-3xl font-bold text-heading mb-2">
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


