/**
 * Video Gallery Section - Горизонтальная галерея портфолио
 * 
 * Server Component, который получает данные из Sanity CMS
 * и передает их в клиентский компонент VideoGalleryClient.
 * 
 * Features:
 * - SSR с ISR (revalidate: 3600)
 * - Получает только featured проекты
 * - Передает данные в Client Component для интерактивности
 */

import { getPortfolioItems } from '@/lib/sanity/queries'
import { VideoGalleryClient } from './VideoGalleryClient'

interface VideoGallerySectionProps {
  title?: string
}

export async function VideoGallerySection({ title }: VideoGallerySectionProps) {
  // Получить только избранные видео из Sanity
  const featuredVideos = await getPortfolioItems({ featured: true, limit: 8 })

  return <VideoGalleryClient videos={featuredVideos} title={title} />
}
