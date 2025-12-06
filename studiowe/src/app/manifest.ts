import { MetadataRoute } from 'next'

/**
 * Web App Manifest для PWA поддержки
 * 
 * Определяет как приложение будет отображаться
 * при установке на устройство пользователя
 */
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'StudioWe - AI-видеопродакшн для бизнеса',
    short_name: 'StudioWe',
    description: 'Создаем десятки AI-роликов для бизнеса. Быстро, юридически безопасно, в едином стиле.',
    start_url: '/',
    display: 'standalone',
    background_color: '#ffffff',
    theme_color: '#0ea5e9',
    icons: [
      {
        src: '/favicon.ico',
        sizes: 'any',
        type: 'image/x-icon',
      },
    ],
  }
}

