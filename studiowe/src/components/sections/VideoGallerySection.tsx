/**
 * Video Gallery Section - Горизонтальная галерея портфолио
 * 
 * Server Component, который получает данные из Sanity CMS
 * и передает их в клиентский компонент VideoGalleryClient.
 * 
 * Features:
 * - SSR с ISR (revalidate: 3600)
 * - Показывает ВСЕ опубликованные проекты из портфолио
 * - Передает данные в Client Component для интерактивности
 * - Горизонтальная прокрутка с автоматическим скрытием scrollbar
 */

import { getPortfolioItems } from '@/lib/sanity/queries'
import { VideoGalleryClient } from './VideoGalleryClient'

interface VideoGallerySectionProps {
  title?: string
}

export async function VideoGallerySection({ title }: VideoGallerySectionProps) {
  // Получить ВСЕ видео из портфолио без ограничений
  // Без фильтра featured и без limit - показываем всё портфолио
  const allVideos = await getPortfolioItems()

  return <VideoGalleryClient videos={allVideos} title={title} />
}
