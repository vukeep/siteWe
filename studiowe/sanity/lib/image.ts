/**
 * Sanity Image URL Builder
 * 
 * Хелпер для построения URL изображений из Sanity.
 * В нашем случае используется редко, т.к. изображения хранятся в Cloudinary.
 * 
 * Оставлен для будущего использования, если потребуется загружать
 * изображения напрямую в Sanity (например, логотипы, иконки).
 */

import imageUrlBuilder from '@sanity/image-url'
import { client } from './client'
import type { SanityImageSource } from '@sanity/image-url/lib/types/types'

const builder = imageUrlBuilder(client)

/**
 * Построить URL для изображения из Sanity
 * 
 * @example
 * ```ts
 * const url = urlFor(image).width(800).height(600).url()
 * ```
 */
export function urlFor(source: SanityImageSource) {
  return builder.image(source)
}


