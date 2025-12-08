import Link from 'next/link'

/**
 * 404 страница - не найдено
 * 
 * Отображается когда пользователь переходит на несуществующую страницу
 * Предлагает вернуться на главную или в портфолио
 */

export default function NotFound() {
  return (
    <main className="min-h-screen flex items-center justify-center py-20 bg-background">
      <div className="container-custom text-center">
        <div className="max-w-2xl mx-auto">
          {/* 404 иллюстрация */}
          <div className="mb-8">
            <span className="text-9xl">🎬</span>
          </div>

          {/* Заголовок */}
          <h1 className="text-6xl md:text-7xl font-bold text-neutral-900 mb-4">
            404
          </h1>
          <h2 className="text-2xl md:text-3xl font-bold text-neutral-700 mb-4">
            Страница не найдена
          </h2>
          
          {/* Описание */}
          <p className="text-lg text-neutral-600 mb-12">
            К сожалению, запрашиваемая страница не существует.<br />
            Возможно, она была удалена или вы перешли по неверной ссылке.
          </p>

          {/* Кнопки навигации */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/"
              className="px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold text-lg transition-all duration-300 shadow-lg hover:shadow-xl"
            >
              На главную
            </Link>
            <Link
              href="/portfolio"
              className="px-8 py-4 bg-neutral-100 hover:bg-neutral-200 text-neutral-900 rounded-lg font-semibold text-lg transition-colors"
            >
              Портфолио
            </Link>
          </div>

          {/* Поиск */}
          <div className="mt-12 pt-8 border-t border-neutral-200">
            <p className="text-neutral-600 mb-4">
              Или свяжитесь с нами, если нужна помощь:
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center text-blue-600">
              <a href="mailto:hello@studiowe.com" className="hover:underline">
                hello@studiowe.com
              </a>
              <span className="hidden sm:inline text-neutral-400">|</span>
              <a href="tel:+79001234567" className="hover:underline">
                +7 (900) 123-45-67
              </a>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}

