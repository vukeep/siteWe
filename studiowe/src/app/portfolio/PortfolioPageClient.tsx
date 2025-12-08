/**
 * Portfolio Page Client Component
 * 
 * Клиентская часть страницы портфолио с интерактивностью:
 * - Фильтрация по категориям
 * - Модальное окно с формой
 * - Управление состоянием
 */

'use client'

import { useState } from 'react'
import { VideoCard } from '@/components/ui/VideoCard'
import { VideoModal } from '@/components/ui/VideoModal'
import { LeadForm } from '@/components/forms/LeadForm'
import type { PortfolioItem, PortfolioCategory } from '@/lib/types/portfolio'

interface PortfolioPageClientProps {
  initialItems: PortfolioItem[]
}

const categories: { value: PortfolioCategory | 'all'; label: string }[] = [
  { value: 'all', label: 'Все работы' },
  { value: 'marketing', label: 'Маркетинг' },
  { value: 'ecommerce', label: 'E-commerce' },
  { value: 'education', label: 'Обучение' },
  { value: 'brand', label: 'Бренд' },
  { value: 'ai-characters', label: 'AI-персонажи' },
  { value: 'series', label: 'Серии' },
]

export function PortfolioPageClient({ initialItems }: PortfolioPageClientProps) {
  const [selectedCategory, setSelectedCategory] = useState<PortfolioCategory | 'all'>('all')
  const [selectedVideo, setSelectedVideo] = useState<PortfolioItem | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isVideoModalOpen, setIsVideoModalOpen] = useState(false)

  // Фильтрация на клиенте
  const portfolioItems =
    selectedCategory === 'all'
      ? initialItems
      : initialItems.filter((item) => item.category === selectedCategory)

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
    setTimeout(() => setSelectedVideo(null), 300)
  }

  const handleCloseVideoModal = () => {
    setIsVideoModalOpen(false)
    setTimeout(() => setSelectedVideo(null), 300)
  }

  const handleFormSuccess = () => {
    setTimeout(() => {
      handleCloseModal()
    }, 2000)
  }

  return (
    <>
      <main className="min-h-screen py-20 pt-32 bg-background">
        <div className="container-custom">
          {/* Заголовок страницы */}
          <div className="text-center mb-12">
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-4 text-neutral-900">
              Портфолио
            </h1>
            <p className="text-lg md:text-xl text-neutral-600 max-w-3xl mx-auto">
              Примеры AI-роликов, созданных нашей студией для различных задач и индустрий
            </p>
          </div>

          {/* Фильтры по категориям */}
          <div className="flex flex-wrap justify-center gap-3 mb-12">
            {categories.map((category) => (
              <button
                key={category.value}
                onClick={() => setSelectedCategory(category.value)}
                className={`px-6 py-3 rounded-lg font-medium transition-all duration-300 ${
                  selectedCategory === category.value
                    ? 'bg-blue-600 text-white shadow-lg scale-105'
                    : 'bg-neutral-100 text-neutral-700 hover:bg-neutral-200'
                }`}
              >
                {category.label}
              </button>
            ))}
          </div>

          {/* Сетка портфолио */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 lg:gap-8">
            {portfolioItems.map((item) => (
              <VideoCard
                key={item.id}
                item={item}
                variant="grid"
                onCTAClick={handleCTAClick}
                onVideoClick={handleVideoClick}
              />
            ))}
          </div>

          {/* Пустое состояние */}
          {portfolioItems.length === 0 && (
            <div className="text-center py-16">
              <p className="text-xl text-neutral-500">
                В этой категории пока нет работ
              </p>
            </div>
          )}

          {/* CTA */}
          <div className="text-center mt-16">
            <h2 className="text-2xl md:text-3xl font-bold mb-4 text-neutral-900">
              Хотите создать такие же ролики?
            </h2>
            <p className="text-lg text-neutral-600 mb-8">
              Свяжитесь с нами для обсуждения вашего проекта
            </p>
            <a
              href="#contacts"
              className="inline-block px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold text-lg transition-all duration-300 shadow-lg hover:shadow-xl"
            >
              Отправить заявку
            </a>
          </div>
        </div>
      </main>

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


