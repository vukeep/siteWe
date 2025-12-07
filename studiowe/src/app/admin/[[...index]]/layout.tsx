/**
 * Sanity Studio Layout
 * 
 * Layout для админ-панели Sanity Studio.
 * Отключает индексацию поисковыми системами.
 */

import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'StudioWe Admin',
  description: 'Панель управления контентом StudioWe',
  robots: {
    index: false,
    follow: false
  }
}

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}


