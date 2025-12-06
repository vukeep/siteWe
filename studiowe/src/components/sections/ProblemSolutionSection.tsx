/**
 * Problem/Solution Section - Второй экран
 * 
 * Сравнивает "Обычный видеопродакшн" vs "С StudioWe"
 * Показывает преимущества работы с AI-технологиями
 * 
 * Структура:
 * - Заголовок секции
 * - Две колонки: Обычно (проблемы) / С нами (решения)
 * - Слоган Studio:We
 */

export function ProblemSolutionSection() {
  const problems = [
    'Видеопродакшен - это дорого и долго',
    '10 исполнителей - 10 разных стилей',
    'Сложные согласования',
    'Нельзя быстро масштабировать',
  ]

  const solutions = [
    '72 часа на производство',
    'Единый стиль и Tone-of-Voice',
    'Любой объем: 10, 20, 50 видео',
    'Юридически безопасные образы',
    'Предсказуемые сроки и бюджет',
  ]

  return (
    <section id="problem-solution" className="snap-section py-20 lg:py-32 bg-neutral-50">
      <div className="container-custom">
        {/* Заголовок секции */}
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-4 text-neutral-900">
            Видеопродакшн без головной боли
          </h2>
          <p className="text-lg md:text-xl text-neutral-600 max-w-3xl mx-auto">
            Мы решаем главные проблемы традиционного видеопроизводства
          </p>
        </div>

        {/* Сравнительная таблица */}
        <div className="grid md:grid-cols-2 gap-6 lg:gap-8 max-w-6xl mx-auto">
          {/* Колонка "Обычно" */}
          <div className="bg-white rounded-2xl p-6 md:p-8 card-shadow">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center">
                <span className="text-2xl">😓</span>
              </div>
              <h3 className="text-2xl md:text-3xl font-bold text-neutral-800">Обычно:</h3>
            </div>
            <ul className="space-y-4">
              {problems.map((problem, index) => (
                <li key={index} className="flex items-start gap-3">
                  <span className="text-red-500 text-xl flex-shrink-0 mt-0.5">✗</span>
                  <span className="text-neutral-700 text-base md:text-lg">{problem}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Колонка "С нами" */}
          <div className="bg-gradient-to-br from-blue-50 via-white to-purple-50 rounded-2xl p-6 md:p-8 card-shadow-lg border-2 border-blue-200">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center">
                <span className="text-2xl">🚀</span>
              </div>
              <h3 className="text-2xl md:text-3xl font-bold text-neutral-800">С нами:</h3>
            </div>
            <ul className="space-y-4">
              {solutions.map((solution, index) => (
                <li key={index} className="flex items-start gap-3">
                  <span className="text-green-500 text-xl flex-shrink-0 mt-0.5">✓</span>
                  <span className="text-neutral-800 text-base md:text-lg font-medium">{solution}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Слоган */}
        <div className="text-center mt-16">
          <p className="text-2xl sm:text-3xl md:text-4xl font-bold text-gradient">
            Studio :We - Инновации, движимые нами
          </p>
        </div>
      </div>
    </section>
  )
}

