/**
 * Sanity Client (Public)
 * 
 * Публичный клиент для чтения данных из Sanity Content Lake.
 * Используется в Server Components для fetch данных портфолио.
 * 
 * Особенности:
 * - useCdn: true - быстрая доставка через CDN
 * - perspective: 'published' - только опубликованный контент
 * - Без токена - безопасен для публичного использования
 */

import { createClient } from 'next-sanity'

export const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET!,
  apiVersion: '2021-03-25', // Стабильная версия Sanity API
  useCdn: true, // Используем CDN для быстрой доставки
  perspective: 'published', // Только опубликованный контент
  stega: {
    enabled: false, // Отключаем stega encoding для production
  }
})


