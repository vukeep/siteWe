/**
 * Sanity Environment Variables
 * 
 * Вспомогательный модуль для валидации environment переменных Sanity.
 */

export const sanityConfig = {
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET!,
  apiVersion: '2021-03-25', // Стабильная версия Sanity API
  useCdn: true,
}

// Валидация переменных окружения
if (!sanityConfig.projectId) {
  throw new Error('Missing NEXT_PUBLIC_SANITY_PROJECT_ID environment variable')
}

if (!sanityConfig.dataset) {
  throw new Error('Missing NEXT_PUBLIC_SANITY_DATASET environment variable')
}

export const sanityToken = process.env.SANITY_API_TOKEN
export const sanityWebhookSecret = process.env.SANITY_WEBHOOK_SECRET


