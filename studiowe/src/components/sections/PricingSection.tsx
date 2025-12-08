/**
 * Pricing Section - Тарифы и стоимость
 * 
 * Согласно Structure.md:
 * - 1 ролик: каждые 10 сек = 10 000 ₽
 * - Start: до 5 роликов до 30 сек = 100 000 ₽ (3 дня)
 * - Growth: до 20 роликов до 30 сек = 300 000 ₽ (7 дней)
 * - Maximum: до 50 роликов до 30 сек = 700 000 ₽ (10 дней)
 */

interface PricingPackage {
  id: string
  name: string
  price: number
  duration: string
  videoCount: string
  features: string[]
  recommended?: boolean
}

const pricingPackages: PricingPackage[] = [
  {
    id: 'start',
    name: 'Start',
    price: 100000,
    duration: '3 рабочих дня',
    videoCount: 'До 5 роликов',
    features: [
      'Длительность до 30 секунд',
      'Единый стиль',
      'Один раунд правок',
      'Форматы для соцсетей',
      'Техническая поддержка',
    ],
  },
  {
    id: 'growth',
    name: 'Growth',
    price: 300000,
    duration: '7 рабочих дней',
    videoCount: 'До 20 роликов',
    recommended: true,
    features: [
      'Длительность до 30 секунд',
      'Единый стиль и брендинг',
      'Два раунда правок',
      'Адаптация под платформы',
      'Приоритетная поддержка',
      'Отдаем по мере готовности',
    ],
  },
  {
    id: 'maximum',
    name: 'Maximum',
    price: 700000,
    duration: '10 рабочих дней',
    videoCount: 'До 50 роликов',
    features: [
      'Длительность до 30 секунд',
      'Полный брендинг',
      'Три раунда правок',
      'Мультиформатная адаптация',
      'Выделенный менеджер',
      'Отдаем по мере готовности',
      'Контент-план в подарок',
    ],
  },
]

export function PricingSection({ title = "Стоимость" }: { title?: string }) {
  return (
    <section id="pricing" className="snap-section py-20 lg:py-32 bg-background">
      <div className="container-custom">
        {/* Заголовок секции */}
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-4 text-heading">
            {title}
          </h2>
          <p className="text-lg md:text-xl text-neutral-600 max-w-3xl mx-auto mb-8">
            Прозрачное ценообразование для любого объема видеопроизводства
          </p>
          
          {/* Базовая стоимость */}
          <div className="inline-block bg-blue-100 border-2 border-blue-300 rounded-2xl px-8 py-4 mb-8">
            <p className="text-2xl md:text-3xl font-bold text-blue-900">
              1 ролик: каждые 10 секунд = <span className="text-blue-600">10 000 ₽</span>
            </p>
          </div>
        </div>

        {/* Тарифные пакеты */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-7xl mx-auto mb-12">
          {pricingPackages.map((pkg) => (
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
                  <span className="bg-blue-600 text-white px-6 py-2 rounded-full text-sm font-bold shadow-lg">
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
                    ? 'bg-blue-600 hover:bg-blue-700 text-white shadow-lg hover:shadow-xl'
                    : 'bg-neutral-100 hover:bg-blue-600 text-neutral-900 hover:text-white'
                }`}
              >
                Выбрать пакет
              </a>
            </div>
          ))}
        </div>

        {/* Индивидуальные проекты */}
        <div className="max-w-4xl mx-auto text-center bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl p-8 md:p-12 border-2 border-blue-200">
          <h3 className="text-2xl md:text-3xl font-bold text-heading mb-4">
            Индивидуальные проекты
          </h3>
          <p className="text-lg text-neutral-700 mb-6">
            Можем изготовить ролик со сложной концепцией любой длительности.<br />
            Сроки и стоимость рассчитываются индивидуально.
          </p>
          <p className="text-xl font-semibold text-blue-600 mb-6">
            💰 Стоимость ниже классического продакшена в десятки раз!
          </p>
          <a
            href="#contacts"
            className="inline-block px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold text-lg transition-all duration-300 shadow-lg hover:shadow-xl"
          >
            Получить точный расчёт
          </a>
        </div>
      </div>
    </section>
  )
}

