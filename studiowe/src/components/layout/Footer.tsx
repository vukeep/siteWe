import Link from 'next/link'

/**
 * Footer компонент
 * 
 * Включает:
 * - Логотип и краткое описание
 * - Навигационные ссылки
 * - Социальные сети (заглушки)
 * - Копирайт и юридические ссылки
 */

const footerLinks = [
  { label: 'Услуги', href: '#services' },
  { label: 'Портфолио', href: '/portfolio' },
  { label: 'Стоимость', href: '#pricing' },
  { label: 'О нас', href: '#about' },
]

const legalLinks = [
  { label: 'Политика конфиденциальности', href: '/privacy' },
  { label: 'Пользовательское соглашение', href: '/terms' },
]

const socialLinks = [
  { label: 'Telegram', href: '#', icon: 'telegram' },
  { label: 'VK', href: '#', icon: 'vk' },
  { label: 'YouTube', href: '#', icon: 'youtube' },
]

export function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="bg-neutral-900 text-neutral-300">
      <div className="container-custom py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
          {/* Логотип и описание */}
          <div className="lg:col-span-2">
            <Link
              href="/"
              className="inline-block text-2xl font-bold text-white hover:text-blue-400 transition-colors mb-4"
            >
              Studio<span className="text-purple-400">:We</span>
            </Link>
            <p className="text-neutral-400 max-w-md mb-6">
              Студия нового поколения, создающая масштабный видеоконтент с применением генеративного ИИ.
              Быстро, юридически безопасно и в едином стиле.
            </p>
            <div className="flex gap-4">
              {socialLinks.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  className="w-10 h-10 flex items-center justify-center rounded-full bg-neutral-800 hover:bg-button text-neutral-400 hover:text-white transition-colors"
                  aria-label={social.label}
                  title={social.label}
                >
                  {/* Заглушки для иконок */}
                  <span className="text-sm font-semibold">
                    {social.icon === 'telegram' && 'TG'}
                    {social.icon === 'vk' && 'VK'}
                    {social.icon === 'youtube' && 'YT'}
                  </span>
                </a>
              ))}
            </div>
          </div>

          {/* Навигация */}
          <div>
            <h3 className="text-white font-semibold text-lg mb-4">Навигация</h3>
            <ul className="space-y-3">
              {footerLinks.map((link) => (
                <li key={link.href}>
                  <a
                    href={link.href}
                    className="text-neutral-400 hover:text-white transition-colors"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Контакты */}
          <div>
            <h3 className="text-white font-semibold text-lg mb-4">Контакты</h3>
            <ul className="space-y-3 text-neutral-400">
              <li>
                <a href="mailto:hello@studiowe.com" className="text-blue-400 hover:text-blue-300 transition-colors">
                  hello@studiowe.com
                </a>
              </li>
              <li>
                <a href="tel:+79001234567" className="text-blue-400 hover:text-blue-300 transition-colors">
                  +7 (900) 123-45-67
                </a>
              </li>
              <li className="text-sm">
                Время работы:<br />
                Пн-Пт: 10:00 - 19:00 МСК
              </li>
            </ul>
          </div>
        </div>

        {/* Разделитель */}
        <div className="border-t border-neutral-800 my-8"></div>

        {/* Копирайт и юридические ссылки */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-neutral-500">
          <p>© {currentYear} Studio:We. Все права защищены.</p>
          <div className="flex gap-6">
            {legalLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="hover:text-white transition-colors"
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  )
}

