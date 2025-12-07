import type { Metadata } from 'next'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import './globals.css'

/**
 * Используем system fonts для оптимальной производительности
 * Определено в globals.css через font-family
 */

/**
 * SEO метаданные для всего сайта
 * Оптимизированы для поисковых систем и социальных сетей
 */
export const metadata: Metadata = {
  title: {
    default: 'StudioWe | AI-видеопродакшн для бизнеса',
    template: '%s | StudioWe',
  },
  description: 'Создаем десятки AI-роликов для бизнеса. Быстро. Юридически безопасно. В едином стиле. Для маркетинга, digital-продвижения, обучения и бренд-коммуникаций.',
  keywords: [
    'AI видеопродакшн',
    'создание видео',
    'маркетинговые ролики',
    'корпоративное видео',
    'AI генерация видео',
    'видеоконтент для бизнеса',
  ],
  authors: [{ name: 'StudioWe' }],
  creator: 'StudioWe',
  publisher: 'StudioWe',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  viewport: {
    width: 'device-width',
    initialScale: 1,
    maximumScale: 5,
    userScalable: true,
  },
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    type: 'website',
    locale: 'ru_RU',
    url: '/',
    siteName: 'StudioWe',
    title: 'StudioWe | AI-видеопродакшн для бизнеса',
    description: 'Создаем десятки AI-роликов для бизнеса. Быстро. Юридически безопасно. В едином стиле.',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'StudioWe - AI-видеопродакшн',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'StudioWe | AI-видеопродакшн для бизнеса',
    description: 'Создаем десятки AI-роликов для бизнеса',
    images: ['/og-image.jpg'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    // Добавьте коды верификации для Google Search Console, Yandex Webmaster и т.д.
    // google: 'your-google-verification-code',
    // yandex: 'your-yandex-verification-code',
  },
}

/**
 * Root Layout компонент
 * Обеспечивает общую структуру для всех страниц
 */
export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ru">
      <body className="antialiased">
        <Header />
        {children}
        <Footer />
      </body>
    </html>
  )
}
