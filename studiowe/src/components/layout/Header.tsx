'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'

/**
 * Header компонент с навигацией
 * 
 * Features:
 * - Прозрачный header на всех страницах
 * - Навигационные элементы в полупрозрачных капсулах
 * - Умная навигация: smooth scroll на главной, переход на главную с других страниц
 * - Адаптивное мобильное меню
 * - Backdrop blur эффект для читаемости
 */

const menuItems = [
  { label: 'Услуги', href: '#services' },
  { label: 'Портфолио', href: '/portfolio', isPage: true }, // Отдельная страница
  { label: 'Процесс', href: '#process' },
  { label: 'Стоимость', href: '#pricing' },
  { label: 'Контакты', href: '#contacts' },
]

export function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const pathname = usePathname()
  const router = useRouter()

  /**
   * Обработка кликов по навигации
   * - Если на главной странице и якорная ссылка - smooth scroll
   * - Если на другой странице и якорная ссылка - переход на главную с якорем
   * - Если обычная ссылка - стандартный переход
   */
  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string, isPage?: boolean) => {
    setIsMobileMenuOpen(false)

    // Если это обычная страница (не якорь), не обрабатываем - пусть Link сработает
    if (isPage) {
      return
    }

    // Якорная ссылка
    if (href.startsWith('#')) {
      e.preventDefault()

      // Если мы на главной странице - скроллим к якорю
      if (pathname === '/') {
        const element = document.querySelector(href)
        if (element) {
          element.scrollIntoView({ behavior: 'smooth', block: 'start' })
        }
      } else {
        // Если мы на другой странице - переходим на главную с якорем
        router.push(`/${href}`)
      }
    }
  }

  return (
    <header className="fixed top-0 left-0 right-0 z-50 transition-all duration-300 bg-transparent py-5">
      <nav className="container-custom">
        <div className="flex items-center justify-between">
          {/* Логотип без капсулы */}
          <Link
            href="/"
            className="text-2xl font-bold text-white hover:text-blue-300 transition-colors"
          >
            Studio<span className="text-blue-300">:We</span>
          </Link>

          {/* Desktop меню - навигация в капсулах */}
          <div className="hidden md:flex items-center gap-3">
            {menuItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={(e) => handleNavClick(e, item.href, item.isPage)}
                className="text-base font-medium transition-all duration-300 text-white hover:text-blue-300 px-4 py-2 rounded-full bg-white/10 backdrop-blur-md hover:bg-white/20"
              >
                {item.label}
              </Link>
            ))}
            {/* CTA кнопка с цветами из админки */}
            <Link
              href="#contacts"
              onClick={(e) => handleNavClick(e, '#contacts')}
              className="px-6 py-2.5 bg-button hover:bg-button-hover text-white rounded-lg font-semibold transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105 active:scale-95"
            >
              Оставить заявку
            </Link>
          </div>

          {/* Mobile menu button в капсуле */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden p-3 text-white hover:text-blue-300 transition-colors rounded-full bg-white/10 backdrop-blur-md hover:bg-white/20"
            aria-label="Открыть меню"
          >
            {isMobileMenuOpen ? (
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            )}
          </button>
        </div>

        {/* Mobile menu с полупрозрачным фоном */}
        {isMobileMenuOpen && (
          <div className="md:hidden mt-4 py-4 rounded-2xl bg-white/10 backdrop-blur-md">
            <div className="flex flex-col gap-3 px-4">
              {menuItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={(e) => handleNavClick(e, item.href, item.isPage)}
                  className="text-base font-medium text-white hover:text-blue-300 transition-all duration-300 px-4 py-2 rounded-full bg-white/5 hover:bg-white/20"
                >
                  {item.label}
                </Link>
              ))}
              <Link
                href="#contacts"
                onClick={(e) => handleNavClick(e, '#contacts')}
                className="px-6 py-3 bg-button hover:bg-button-hover text-white rounded-lg font-semibold text-center transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105 active:scale-95"
              >
                Оставить заявку
              </Link>
            </div>
          </div>
        )}
      </nav>
    </header>
  )
}

