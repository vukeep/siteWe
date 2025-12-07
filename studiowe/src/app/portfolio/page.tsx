/**
 * Portfolio Page
 * 
 * Server Component, который получает все проекты из Sanity CMS
 * и передает их в клиентский компонент для фильтрации и отображения.
 * 
 * Features:
 * - SSR с ISR (revalidate: 3600)
 * - Получает все проекты одним запросом
 * - Фильтрация на клиенте для быстрой UX
 */

import { getPortfolioItems } from '@/lib/sanity/queries'
import { PortfolioPageClient } from './PortfolioPageClient'

export default async function PortfolioPage() {
  // Получить все проекты из Sanity
  const allItems = await getPortfolioItems()

  return <PortfolioPageClient initialItems={allItems} />
}
