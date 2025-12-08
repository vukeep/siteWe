'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { cn } from '@/lib/utils'

/**
 * Header компонент с навигацией
 * 
 * Features:
 * - Sticky header при скролле
 * - Умная навигация: smooth scroll на главной, переход на главную с других страниц
 * - Адаптивное мобильное меню
 * - Анимация появления/скрытия при скролле
 */

const menuItems = [
  { label: 'Услуги', href: '#services' },
  { label: 'Портфолио', href: '/portfolio', isPage: true }, // Отдельная страница
  { label: 'Процесс', href: '#process' },
  { label: 'Стоимость', href: '#pricing' },
  { label: 'Контакты', href: '#contacts' },
]

export function Header() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const pathname = usePathname()
  const router = useRouter()

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50)
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

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
    <header
      className={cn(
        'fixed top-0 left-0 right-0 z-50 transition-all duration-300',
        isScrolled
          ? 'bg-white/95 backdrop-blur-md shadow-md py-3'
          : 'bg-transparent py-5'
      )}
    >
      <nav className="container-custom">
        <div className="flex items-center justify-between">
          {/* Логотип */}
          <Link
            href="/"
            className="text-2xl font-bold text-blue-600 hover:text-blue-700 transition-colors"
          >
            Studio<span className="text-purple-600">:We</span>
          </Link>

          {/* Desktop меню */}
          <div className="hidden md:flex items-center gap-8">
            {menuItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={(e) => handleNavClick(e, item.href, item.isPage)}
                className={cn(
                  'text-base font-medium transition-colors',
                  isScrolled
                    ? 'text-neutral-700 hover:text-blue-600'
                    : 'text-neutral-800 hover:text-blue-600'
                )}
              >
                {item.label}
              </Link>
            ))}
            <Link
              href="#contacts"
              onClick={(e) => handleNavClick(e, '#contacts')}
              className="px-6 py-2.5 bg-button hover:bg-button-hover text-white rounded-lg font-semibold transition-colors"
            >
              Оставить заявку
            </Link>
          </div>

          {/* Mobile menu button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden p-2 text-neutral-700 hover:text-blue-600 transition-colors"
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

        {/* Mobile menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden mt-4 py-4 border-t border-neutral-200">
            <div className="flex flex-col gap-4">
              {menuItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={(e) => handleNavClick(e, item.href, item.isPage)}
                  className="text-base font-medium text-neutral-700 hover:text-blue-600 transition-colors"
                >
                  {item.label}
                </Link>
              ))}
              <Link
                href="#contacts"
                onClick={(e) => handleNavClick(e, '#contacts')}
                className="px-6 py-2.5 bg-button hover:bg-button-hover text-white rounded-lg font-semibold text-center transition-colors"
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

