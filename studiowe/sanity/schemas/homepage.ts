/**
 * Sanity Schema: Homepage Settings
 * 
 * Настройки главной страницы, включая hero video
 */

import { defineType, defineField } from 'sanity'
import { CloudinaryVideoInput } from '../components/CloudinaryVideoInput'

export default defineType({
  name: 'homepage',
  title: 'Настройки Главной Страницы',
  type: 'document',
  fields: [
    // ========================================
    // HERO VIDEO - ВТОРОЙ ЭКРАН
    // ========================================
    defineField({
      name: 'heroVideoEnabled',
      title: '🎬 Включить Hero Video',
      type: 'boolean',
      description: 'Показывать полноэкранное видео на втором экране',
      initialValue: true
    }),
    defineField({
      name: 'heroVideoTitle',
      title: '📝 Заголовок Hero Video',
      type: 'string',
      description: 'Опциональный заголовок над видео',
      placeholder: 'Смотрите, как мы создаем AI-ролики'
    }),
    defineField({
      name: 'cloudinaryBaseUrl',
      title: '📹 Исходный URL видео',
      type: 'string',
      description: '🔗 Вставьте базовый URL из Cloudinary. Оптимизированные версии создадутся автоматически.',
      components: {
        input: CloudinaryVideoInput
      },
      validation: (Rule) => Rule.custom((url) => {
        if (!url) return true
        if (typeof url !== 'string') return '⚠️ URL должен быть строкой'
        if (!url.includes('res.cloudinary.com')) {
          return '⚠️ URL должен быть из Cloudinary (res.cloudinary.com)'
        }
        if (!url.includes('/upload/')) {
          return '⚠️ URL должен содержать /upload/'
        }
        return true
      })
    }),
    defineField({
      name: 'heroVideoUrl',
      title: '🎬 Оптимизированное видео',
      type: 'url',
      description: '✨ Автоматически генерируется из исходного URL. Можно редактировать вручную.',
      readOnly: false
    }),
    defineField({
      name: 'heroPosterUrl',
      title: '🖼️ Постер (первый кадр)',
      type: 'url',
      description: '✨ Автоматически генерируется из исходного URL. Можно редактировать вручную.',
      readOnly: false
    }),
    defineField({
      name: 'heroVideoAutoplay',
      title: '▶️ Автозапуск видео',
      type: 'boolean',
      description: 'Автоматически запускать видео при появлении на экране',
      initialValue: true
    }),
    defineField({
      name: 'heroVideoMuted',
      title: '🔇 Без звука по умолчанию',
      type: 'boolean',
      description: 'Запускать видео без звука (рекомендуется для autoplay)',
      initialValue: true
    }),
    defineField({
      name: 'heroVideoLoop',
      title: '🔁 Зациклить видео',
      type: 'boolean',
      description: 'Повторять видео после окончания',
      initialValue: false
    }),
    
    // ========================================
    // ДОПОЛНИТЕЛЬНЫЕ НАСТРОЙКИ
    // ========================================
    defineField({
      name: 'lastModified',
      title: 'Последнее изменение',
      type: 'datetime',
      readOnly: true,
      initialValue: () => new Date().toISOString()
    })
  ],
  preview: {
    prepare() {
      return {
        title: '🏠 Главная страница',
        subtitle: 'Настройки и контент'
      }
    }
  }
})

