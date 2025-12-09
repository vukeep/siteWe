'use client'

/**
 * Hero Section - Первый экран сайта с фоновым видео
 * 
 * Включает:
 * - Фоновое видео из Cloudinary (настраивается через админку)
 * - Затемнение для читаемости текста
 * - Крупный заголовок с градиентом
 * - Подзаголовок с описанием
 * - CTA кнопку "Посмотреть примеры работ"
 * - Адаптивную верстку
 */

interface HeroSectionProps {
  videoUrl?: string
  posterUrl?: string
  videoAutoplay?: boolean
  videoMuted?: boolean
  videoLoop?: boolean
}

export function HeroSection({
  videoUrl,
  posterUrl,
  videoAutoplay = true,
  videoMuted = true,
  videoLoop = true,
}: HeroSectionProps) {
  const handleCTAClick = () => {
    const portfolioSection = document.querySelector('#portfolio')
    if (portfolioSection) {
      portfolioSection.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
  }

  return (
    <section
      id="hero"
      className="snap-section relative flex flex-col items-center justify-center py-20 pt-32 bg-background overflow-hidden min-h-screen"
    >
      {/* Фоновое видео из админки */}
      {videoUrl && (
        <>
          <video
            className="absolute inset-0 w-full h-full object-cover"
            src={videoUrl}
            poster={posterUrl}
            autoPlay={videoAutoplay}
            muted={videoMuted}
            loop={videoLoop}
            playsInline
            preload="metadata"
          />
          {/* Затемнение для читаемости текста (градиент от полупрозрачного к темному) */}
          <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/60 to-black/70" />
        </>
      )}

      {/* Контент поверх видео */}
      <div className="container-custom relative z-10">
        <div className="text-center space-y-6 max-w-5xl mx-auto">
          {/* Заголовок с белым текстом для контраста с видео */}
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight leading-tight text-white drop-shadow-2xl">
            Создаем десятки{' '}
            <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent drop-shadow-lg">
              AI-роликов
            </span>
            {' '}для бизнеса
          </h1>

          {/* Подзаголовок */}
          <p className="text-xl sm:text-2xl md:text-3xl text-white font-medium drop-shadow-lg">
            Быстро. Юридически безопасно. В едином стиле.
          </p>

          {/* Описание */}
          <p className="text-base sm:text-lg md:text-xl text-gray-200 max-w-3xl mx-auto drop-shadow-md">
            Для маркетинга, digital-продвижения, обучения и бренд-коммуникаций
          </p>

          {/* CTA кнопка */}
          <div className="pt-8">
            <button
              onClick={handleCTAClick}
              className="px-8 py-4 bg-button hover:bg-button-hover text-white rounded-lg font-semibold text-lg transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105 active:scale-95"
            >
              Посмотреть примеры работ
            </button>
          </div>

          {/* Дополнительная информация с улучшенным контрастом */}
          <div className="pt-12 grid grid-cols-1 sm:grid-cols-3 gap-8 max-w-3xl mx-auto">
            <div className="text-center backdrop-blur-sm bg-white/10 rounded-xl p-4">
              <div className="text-3xl font-bold text-blue-300 drop-shadow-lg">72 часа</div>
              <div className="text-sm text-gray-200 mt-1">на производство</div>
            </div>
            <div className="text-center backdrop-blur-sm bg-white/10 rounded-xl p-4">
              <div className="text-3xl font-bold text-purple-300 drop-shadow-lg">50+ роликов</div>
              <div className="text-sm text-gray-200 mt-1">в одном заказе</div>
            </div>
            <div className="text-center backdrop-blur-sm bg-white/10 rounded-xl p-4">
              <div className="text-3xl font-bold text-pink-300 drop-shadow-lg">100%</div>
              <div className="text-sm text-gray-200 mt-1">юридически чисто</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
