/**
 * Cloudinary URL Helpers
 * 
 * Утилиты для автоматической генерации трансформированных URL из Cloudinary
 */

/**
 * Применяет трансформации к базовому Cloudinary URL
 * 
 * @example
 * const baseUrl = "https://res.cloudinary.com/avitophoto/video/upload/v1765009796/studiowe/video.mp4"
 * const optimized = applyCloudinaryTransform(baseUrl, "f_auto,q_auto")
 * // => "https://res.cloudinary.com/avitophoto/video/upload/f_auto,q_auto/v1765009796/studiowe/video.mp4"
 */
export function applyCloudinaryTransform(url: string, transform: string): string {
  if (!url || typeof url !== 'string') return ''
  
  // Проверяем что это Cloudinary URL
  if (!url.includes('res.cloudinary.com')) {
    console.warn('⚠️ Не Cloudinary URL:', url)
    return url
  }

  // Если трансформации уже есть, не добавляем повторно
  if (url.includes(transform)) {
    return url
  }

  // Паттерн: /upload/ → /upload/{transform}/
  const uploadPattern = /\/upload\//
  
  if (!uploadPattern.test(url)) {
    console.warn('⚠️ Не найден паттерн /upload/ в URL:', url)
    return url
  }

  return url.replace(uploadPattern, `/upload/${transform}/`)
}

/**
 * Генерирует оптимизированный URL видео
 * Применяет: f_auto (авто-формат), q_auto (авто-качество)
 */
export function getOptimizedVideoUrl(baseUrl: string): string {
  return applyCloudinaryTransform(baseUrl, 'f_auto,q_auto')
}

/**
 * Генерирует URL постера (первый кадр видео)
 * Применяет: so_0 (первый кадр), f_webp (формат webp), q_auto (авто-качество)
 * 
 * @param baseUrl - базовый URL видео
 * @returns URL постера в формате .webp
 */
export function getVideoPosterUrl(baseUrl: string): string {
  if (!baseUrl) return ''
  
  // Применяем трансформации
  let posterUrl = applyCloudinaryTransform(baseUrl, 'so_0,f_webp,q_auto')
  
  // Меняем расширение с .mp4 на .webp
  posterUrl = posterUrl.replace(/\.(mp4|mov|avi|webm)$/i, '.webp')
  
  return posterUrl
}

/**
 * Извлекает public_id из Cloudinary URL
 * 
 * @example
 * const url = "https://res.cloudinary.com/avitophoto/video/upload/v1765009796/studiowe/video.mp4"
 * const publicId = extractPublicId(url)
 * // => "studiowe/video"
 */
export function extractPublicId(url: string): string | null {
  if (!url) return null
  
  // Паттерн: /upload/{version}/path/to/file.ext
  const match = url.match(/\/upload\/(?:v\d+\/)?(.+)\.[^.]+$/)
  
  if (!match) return null
  
  return match[1]
}

/**
 * Валидирует что URL является корректным Cloudinary URL
 */
export function isValidCloudinaryUrl(url: string): boolean {
  if (!url || typeof url !== 'string') return false
  
  // Проверяем базовые паттерны Cloudinary
  const patterns = [
    /^https:\/\/res\.cloudinary\.com\//,
    /\/upload\//
  ]
  
  return patterns.every(pattern => pattern.test(url))
}

