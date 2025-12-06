/**
 * Video Formats Section - Какие ролики мы создаем
 * 
 * Отображает 6 категорий форматов роликов:
 * 1. Маркетинг и продажи
 * 2. E-commerce
 * 3. Обучение и HR
 * 4. Бренд-контент
 * 5. AI-персонажи
 * 6. Серии роликов
 * 
 * Каждая категория имеет:
 * - Иконку (emoji заглушка)
 * - Заголовок
 * - Список подкатегорий
 */

interface VideoFormat {
  id: string
  title: string
  icon: string
  subcategories: string[]
}

const videoFormats: VideoFormat[] = [
  {
    id: 'marketing',
    title: 'Маркетинг и продажи',
    icon: '📈',
    subcategories: [
      'Рекламные ролики для соцсетей',
      'Performance-креативы',
      'Промо и акции',
      'Объясняющие видео',
    ],
  },
  {
    id: 'ecommerce',
    title: 'E-commerce',
    icon: '🛒',
    subcategories: [
      'Видео-карточки товаров',
      'Обзоры и демонстрации продуктов',
    ],
  },
  {
    id: 'education',
    title: 'Обучение и HR',
    icon: '🎓',
    subcategories: [
      'Онбординг',
      'Инструкции и обучающие ролики',
      'Внутренние коммуникации',
    ],
  },
  {
    id: 'brand',
    title: 'Бренд-контент',
    icon: '✨',
    subcategories: [
      'Имиджевые ролики',
      'Видео для событий и презентаций',
      'HR-бренд',
    ],
  },
  {
    id: 'ai-characters',
    title: 'AI-персонажи',
    icon: '🤖',
    subcategories: [
      'Ролики с цифровыми актерами',
      'Виртуальные ведущие и инфлюенсеры',
    ],
  },
  {
    id: 'series',
    title: 'Серии роликов',
    icon: '🎬',
    subcategories: [
      'Пакеты 10/30/50/100+ для кампаний',
      'Контент-сетки для соцсетей',
    ],
  },
]

export function VideoFormatsSection() {
  return (
    <section id="services" className="snap-section py-20 lg:py-32 bg-white">
      <div className="container-custom">
        {/* Заголовок секции */}
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-4 text-neutral-900">
            Какие ролики мы создаем
          </h2>
          <p className="text-lg md:text-xl text-neutral-600 max-w-3xl mx-auto">
            Любые форматы видеоконтента для вашего бизнеса
          </p>
        </div>

        {/* Сетка форматов */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8 max-w-7xl mx-auto">
          {videoFormats.map((format) => (
            <div
              key={format.id}
              className="bg-white rounded-2xl p-6 md:p-8 card-shadow hover:card-shadow-lg transition-all duration-300 hover:-translate-y-1 border border-neutral-100 hover:border-blue-200"
            >
              {/* Иконка */}
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary-50 to-secondary-50 flex items-center justify-center mb-4">
                <span className="text-4xl">{format.icon}</span>
              </div>

              {/* Заголовок */}
              <h3 className="text-xl md:text-2xl font-bold text-neutral-900 mb-4">
                {format.title}
              </h3>

              {/* Подкатегории */}
              <ul className="space-y-2">
                {format.subcategories.map((subcategory, index) => (
                  <li
                    key={index}
                    className="flex items-start gap-2 text-neutral-700"
                  >
                    <span className="text-blue-500 mt-1.5 flex-shrink-0">•</span>
                    <span className="text-sm md:text-base">{subcategory}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="text-center mt-12">
          <p className="text-neutral-600 mb-6">
            Не нашли нужный формат? Напишите нам, и мы подберем решение под вашу задачу
          </p>
          <a
            href="#contacts"
            className="inline-block px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold text-lg transition-all duration-300 shadow-lg hover:shadow-xl"
          >
            Обсудить проект
          </a>
        </div>
      </div>
    </section>
  )
}

