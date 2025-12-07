/**
 * Portfolio Document Hooks
 * 
 * Автоматическое обновление videoUrl и posterUrl при изменении cloudinaryBaseUrl
 */

import { getOptimizedVideoUrl, getVideoPosterUrl, isValidCloudinaryUrl } from './cloudinary-helpers'

/**
 * Hook для автоматического обновления трансформированных URL
 * Вызывается перед сохранением документа
 */
export function syncCloudinaryUrls(document: any): any {
  // Если нет базового URL или он не изменился - пропускаем
  if (!document.cloudinaryBaseUrl) {
    return document
  }

  const baseUrl = document.cloudinaryBaseUrl

  // Валидация
  if (!isValidCloudinaryUrl(baseUrl)) {
    console.warn('⚠️ Invalid Cloudinary URL:', baseUrl)
    return document
  }

  // Генерируем трансформированные URL
  const optimizedVideoUrl = getOptimizedVideoUrl(baseUrl)
  const posterUrl = getVideoPosterUrl(baseUrl)

  // Обновляем только если значения изменились или не заданы
  const updates: any = {}

  if (!document.videoUrl || document.videoUrl !== optimizedVideoUrl) {
    updates.videoUrl = optimizedVideoUrl
    console.log('✅ Auto-update videoUrl:', optimizedVideoUrl)
  }

  if (!document.posterUrl || document.posterUrl !== posterUrl) {
    updates.posterUrl = posterUrl
    console.log('✅ Auto-update posterUrl:', posterUrl)
  }

  // Возвращаем обновленный документ
  if (Object.keys(updates).length > 0) {
    return {
      ...document,
      ...updates
    }
  }

  return document
}

