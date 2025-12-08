'use client'

import { ParticleBackground } from '@/components/effects/ParticleBackground'

/**
 * Hero Section - Первый экран сайта
 * 
 * Включает:
 * - Интерактивное облако частиц на фоне
 * - Крупный заголовок с градиентом
 * - Подзаголовок с описанием
 * - CTA кнопку "Посмотреть примеры работ"
 * - Адаптивную верстку
 */

export function HeroSection() {
  const handleCTAClick = () => {
    const portfolioSection = document.querySelector('#portfolio')
    if (portfolioSection) {
      portfolioSection.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
  }

  return (
    <section
      id="hero"
      className="snap-section relative flex flex-col items-center justify-center py-20 pt-32 bg-background overflow-hidden"
    >
      {/* Интерактивное облако частиц с градиентной анимацией */}
      <ParticleBackground
        particleCount={150}
        maxSpeed={2.5}
        attractionStrength={0.0004}
        repulsionStrength={0.8}
        repulsionRadius={60}
        colors={[
          '59, 130, 246',   // blue-600
          '168, 85, 247',   // purple-600
          '236, 72, 153',   // pink-600
          '34, 197, 94',    // green-500
        ]}
        colorTransitionDuration={3}
        colorHoldDuration={2}
      />

      <div className="container-custom relative z-10">
        <div className="text-center space-y-6 max-w-5xl mx-auto">
          {/* Заголовок */}
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight leading-tight">
            Создаем десятки{' '}
            <span className="text-gradient">
              AI-роликов
            </span>
            {' '}для бизнеса
          </h1>

          {/* Подзаголовок */}
          <p className="text-xl sm:text-2xl md:text-3xl text-neutral-700 font-medium">
            Быстро. Юридически безопасно. В едином стиле.
          </p>

          {/* Описание */}
          <p className="text-base sm:text-lg md:text-xl text-neutral-600 max-w-3xl mx-auto">
            Для маркетинга, digital-продвижения, обучения и бренд-коммуникаций
          </p>

          {/* CTA кнопка */}
          <div className="pt-8">
            <button
              onClick={handleCTAClick}
              className="px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold text-lg transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105 active:scale-95"
            >
              Посмотреть примеры работ
            </button>
          </div>

          {/* Дополнительная информация */}
          <div className="pt-12 grid grid-cols-1 sm:grid-cols-3 gap-8 max-w-3xl mx-auto">
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-600">72 часа</div>
              <div className="text-sm text-neutral-600 mt-1">на производство</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-600">50+ роликов</div>
              <div className="text-sm text-neutral-600 mt-1">в одном заказе</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-600">100%</div>
              <div className="text-sm text-neutral-600 mt-1">юридически чисто</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
