import type { Metadata } from 'next'

/**
 * Layout для страниц портфолио
 * Определяет SEO метаданные для всего раздела портфолио
 */

export const metadata: Metadata = {
  title: 'Портфолио | Примеры работ',
  description: 'Портфолио AI-видеопродакшн студии StudioWe. Примеры созданных роликов для маркетинга, e-commerce, обучения и бренд-коммуникаций.',
  keywords: [
    'портфолио видео',
    'примеры AI роликов',
    'видеопродакшн примеры',
    'AI видео примеры',
    'маркетинговые ролики портфолио',
  ],
  openGraph: {
    title: 'Портфолио StudioWe | Примеры AI-роликов',
    description: 'Примеры созданных AI-роликов для различных бизнесов и индустрий',
    type: 'website',
  },
  alternates: {
    canonical: '/portfolio',
  },
}

export default function PortfolioLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}

