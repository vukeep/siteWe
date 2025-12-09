/**
 * Pricing Section - Тарифы и стоимость
 * 
 * Server Component, получающий данные из Sanity CMS.
 * Все тарифы управляются через админку:
 * - /admin/structure/pricingPlan - управление тарифными планами
 * - /admin/structure/pricingSettings - настройки секции (заголовки, базовая стоимость)
 * 
 * Features:
 * - SSR с ISR (revalidate: 3600)
 * - Динамическое обновление цен и пакетов
 * - Кастомизация всех текстов через админку
 */

import { getPricingPlans, getPricingSettings } from '@/lib/sanity/queries'

export async function PricingSection() {
  // Получаем данные из Sanity
  const plans = await getPricingPlans()
  const settings = await getPricingSettings()

  // Fallback значения если настройки не загружены
  const title = settings?.title || 'Стоимость'
  const subtitle = settings?.subtitle || 'Прозрачное ценообразование для любого объема видеопроизводства'
  const basePrice = settings?.basePricePerTenSeconds || 10000
  const basePriceDesc = settings?.basePriceDescription || '1 ролик: каждые 10 секунд ='
  return (
    <section id="pricing" className="snap-section py-20 lg:py-32 bg-background">
      <div className="container-custom">
        {/* Заголовок секции */}
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-4 text-heading">
            {title}
          </h2>
          <p className="text-lg md:text-xl text-neutral-600 max-w-3xl mx-auto mb-8">
            {subtitle}
          </p>
          
          {/* Базовая стоимость из админки */}
          <div className="inline-block bg-blue-100 border-2 border-blue-300 rounded-2xl px-8 py-4 mb-8">
            <p className="text-2xl md:text-3xl font-bold text-blue-900">
              {basePriceDesc} <span className="text-blue-600">{basePrice.toLocaleString('ru-RU')} ₽</span>
            </p>
          </div>
        </div>

        {/* Тарифные пакеты из админки */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-7xl mx-auto mb-12">
          {plans.map((pkg) => (
            <div
              key={pkg.id}
              className={`relative bg-white rounded-2xl p-8 transition-all duration-300 ${
                pkg.recommended
                  ? 'border-4 border-blue-600 shadow-2xl scale-105 md:scale-110'
                  : 'border-2 border-neutral-200 card-shadow hover:card-shadow-lg hover:scale-105'
              }`}
            >
              {/* Бейдж "Популярный" */}
              {pkg.recommended && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <span className="bg-button text-white px-6 py-2 rounded-full text-sm font-bold shadow-lg">
                    ⭐ Популярный
                  </span>
                </div>
              )}

              {/* Название */}
              <h3 className="text-2xl md:text-3xl font-bold text-heading mb-2">
                {pkg.name}
              </h3>

              {/* Количество роликов */}
              <p className="text-lg text-neutral-600 mb-4">{pkg.videoCount}</p>

              {/* Цена */}
              <div className="mb-6">
                <span className="text-4xl md:text-5xl font-bold text-blue-600">
                  {(pkg.price / 1000).toLocaleString('ru-RU')}
                </span>
                <span className="text-2xl text-neutral-600"> тыс. ₽</span>
              </div>

              {/* Срок */}
              <p className="text-neutral-700 mb-6 pb-6 border-b border-neutral-200">
                ⏱️ Срок: <span className="font-semibold">{pkg.duration}</span>
              </p>

              {/* Особенности */}
              <ul className="space-y-3 mb-8">
                {pkg.features.map((feature, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <span className="text-green-500 text-xl flex-shrink-0">✓</span>
                    <span className="text-neutral-700">{feature}</span>
                  </li>
                ))}
              </ul>

              {/* Кнопка */}
              <a
                href="#contacts"
                className={`block w-full px-6 py-4 rounded-lg font-semibold text-center transition-all duration-300 ${
                  pkg.recommended
                    ? 'bg-button hover:bg-button-hover text-white shadow-lg hover:shadow-xl'
                    : 'bg-neutral-100 hover:bg-button text-neutral-900 hover:text-white'
                }`}
              >
                Выбрать пакет
              </a>
            </div>
          ))}
        </div>

        {/* Индивидуальные проекты - тексты из админки */}
        <div className="max-w-4xl mx-auto text-center bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl p-8 md:p-12 border-2 border-blue-200">
          <h3 className="text-2xl md:text-3xl font-bold text-heading mb-4">
            {settings?.customProjectTitle || 'Индивидуальные проекты'}
          </h3>
          <p className="text-lg text-neutral-700 mb-6 whitespace-pre-line">
            {settings?.customProjectDescription || 'Можем изготовить ролик со сложной концепцией любой длительности.\nСроки и стоимость рассчитываются индивидуально.'}
          </p>
          <p className="text-xl font-semibold text-blue-600 mb-6">
            {settings?.customProjectHighlight || '💰 Стоимость ниже классического продакшена в десятки раз!'}
          </p>
          <a
            href="#contacts"
            className="inline-block px-8 py-4 bg-button hover:bg-button-hover text-white rounded-lg font-semibold text-lg transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105 active:scale-95"
          >
            {settings?.customProjectButtonText || 'Получить точный расчёт'}
          </a>
        </div>
      </div>
    </section>
  )
}

