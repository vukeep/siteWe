/**
 * Benefits Section - Почему с нами удобно работать
 * 
 * Согласно Structure.md отображает 7 преимуществ:
 * 1. Скорость
 * 2. Масштаб
 * 3. Юридическая чистота
 * 4. Единый стиль
 * 5. Любые форматы
 * 6. Гибкость
 * 7. Предсказуемый результат
 * 
 * + Миссия компании
 */

interface Benefit {
  id: string
  title: string
  description: string
  icon: string
}

const benefits: Benefit[] = [
  {
    id: 'speed',
    title: 'Скорость',
    description: '72 часа на производство первых роликов. Масштабные серии — до 10 дней.',
    icon: '⚡',
  },
  {
    id: 'scale',
    title: 'Масштаб',
    description: 'От 1 до 100+ роликов без потери качества и единого стиля.',
    icon: '📈',
  },
  {
    id: 'legal',
    title: 'Юридическая чистота',
    description: 'Все образы созданы ИИ, нет рисков с правами и авторством.',
    icon: '✅',
  },
  {
    id: 'style',
    title: 'Единый стиль',
    description: 'Узнаваемая визуальная идентичность во всех роликах серии.',
    icon: '🎨',
  },
  {
    id: 'formats',
    title: 'Любые форматы',
    description: 'Вертикальные, квадратные, горизонтальные — под любую платформу.',
    icon: '📱',
  },
  {
    id: 'flexibility',
    title: 'Гибкость',
    description: 'Быстрые правки и адаптация под изменяющиеся требования.',
    icon: '🔄',
  },
  {
    id: 'predictable',
    title: 'Предсказуемый результат',
    description: 'Фиксированные сроки и бюджет, согласованный процесс.',
    icon: '🎯',
  },
]

export function BenefitsSection({ title = "Почему с нами удобно работать" }: { title?: string }) {
  return (
    <section id="benefits" className="snap-section py-20 lg:py-32 bg-background">
      <div className="container-custom">
        {/* Заголовок секции */}
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-4 text-neutral-900">
            {title}
          </h2>
          <p className="text-lg md:text-xl text-neutral-600 max-w-3xl mx-auto">
            Мы объединяем скорость AI с экспертизой профессионального видеопродакшна
          </p>
        </div>

        {/* Сетка преимуществ */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 lg:gap-8 max-w-7xl mx-auto mb-16">
          {benefits.map((benefit) => (
            <div
              key={benefit.id}
              className="bg-neutral-50 rounded-2xl p-6 md:p-8 hover:bg-blue-50 transition-all duration-300 border-2 border-neutral-100 hover:border-blue-200 hover:scale-105"
            >
              {/* Иконка */}
              <div className="w-16 h-16 rounded-2xl bg-white flex items-center justify-center mb-4 shadow-md">
                <span className="text-4xl">{benefit.icon}</span>
              </div>

              {/* Заголовок */}
              <h3 className="text-xl font-bold text-neutral-900 mb-3">
                {benefit.title}
              </h3>

              {/* Описание */}
              <p className="text-neutral-700 leading-relaxed">
                {benefit.description}
              </p>
            </div>
          ))}
        </div>

        {/* Миссия */}
        <div className="max-w-5xl mx-auto">
          <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-3xl p-8 md:p-12 border-2 border-blue-200 text-center">
            <h3 className="text-2xl md:text-3xl font-bold text-neutral-900 mb-6">
              Наша цель
            </h3>
            <p className="text-lg md:text-xl text-neutral-800 leading-relaxed">
              Снизить затраты на видеопродакшн <span className="font-bold text-blue-600">без потери качества</span> и без ограничений в сюжетах. 
              Мы не создаем фейки, мы создаем <span className="font-bold text-purple-600">системную визуальную коммуникацию</span>, 
              где ИИ служит инструментом масштабирования и креативной реализации.
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}

