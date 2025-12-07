/**
 * Sanity Server Client (с токеном)
 * 
 * Клиент с правами записи для server-side операций.
 * Используется для:
 * - Сохранения заявок из форм
 * - Миграции данных
 * - Admin операций
 * 
 * Особенности:
 * - useCdn: false - свежие данные без кэша
 * - token - полные права записи/чтения
 * - Только для server-side использования!
 */

import { createClient } from '@sanity/client'

export const serverClient = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET!,
  apiVersion: '2021-03-25', // Стабильная версия Sanity API
  useCdn: false, // Не используем CDN для операций записи
  token: process.env.SANITY_API_TOKEN, // Токен с правами записи
  perspective: 'published',
})

/**
 * Вспомогательная функция для безопасного создания документов
 */
export async function createDocument<T extends { _type: string }>(doc: T) {
  try {
    const result = await serverClient.create(doc)
    return { success: true, data: result }
  } catch (error) {
    console.error('Sanity create error:', error)
    return { success: false, error }
  }
}

/**
 * Вспомогательная функция для обновления документов
 */
export async function updateDocument<T extends Record<string, any>>(
  id: string,
  updates: Partial<T>
) {
  try {
    const result = await serverClient.patch(id).set(updates).commit()
    return { success: true, data: result }
  } catch (error) {
    console.error('Sanity update error:', error)
    return { success: false, error }
  }
}


