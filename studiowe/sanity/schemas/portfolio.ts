/**
 * Sanity Schema: Portfolio
 * 
 * Схема для управления портфолио проектами через Sanity CMS.
 * Видео и постеры хранятся в Cloudinary, здесь только URL.
 * 
 * Автоматические трансформации:
 * - videoUrl: оптимизация качества (f_auto,q_auto)
 * - posterUrl: первый кадр в webp (so_0,f_webp,q_auto)
 */

import { defineType, defineField } from 'sanity'
import { getOptimizedVideoUrl, getVideoPosterUrl } from '../lib/cloudinary-helpers'
import { CloudinaryVideoInput } from '../components/CloudinaryVideoInput'

export default defineType({
  name: 'portfolio',
  title: 'Портфолио',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Название проекта',
      type: 'string',
      validation: (Rule) => Rule.required()
    }),
    defineField({
      name: 'slug',
      title: 'URL slug',
      type: 'slug',
      options: {
        source: 'title',
        maxLength: 96
      },
      validation: (Rule) => Rule.required()
    }),
    defineField({
      name: 'description',
      title: 'Описание',
      type: 'text',
      rows: 3,
      validation: (Rule) => Rule.required().min(10)
    }),
    defineField({
      name: 'category',
      title: 'Категория',
      type: 'string',
      options: {
        list: [
          { title: 'Маркетинг', value: 'marketing' },
          { title: 'E-commerce', value: 'ecommerce' },
          { title: 'Обучение', value: 'education' },
          { title: 'Бренд', value: 'brand' },
          { title: 'AI-персонажи', value: 'ai-characters' },
          { title: 'Серии', value: 'series' }
        ],
        layout: 'radio'
      },
      validation: (Rule) => Rule.required()
    }),
    // ========================================
    // CLOUDINARY ВИДЕО - УМНЫЕ ПОЛЯ
    // ========================================
    defineField({
      name: 'cloudinaryBaseUrl',
      title: '📹 Исходный URL видео',
      type: 'string',
      description: '🔗 Вставьте базовый URL из Cloudinary. Оптимизированные версии создадутся автоматически.',
      components: {
        input: CloudinaryVideoInput
      },
      validation: (Rule) => Rule.required()
        .custom((url) => {
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
      name: 'videoUrl',
      title: '🎬 Оптимизированное видео',
      type: 'url',
      description: '✨ Автоматически генерируется из исходного URL. Можно редактировать вручную.',
      readOnly: false // Разрешаем редактирование
    }),
    defineField({
      name: 'posterUrl',
      title: '🖼️ Постер (первый кадр)',
      type: 'url',
      description: '✨ Автоматически генерируется из исходного URL. Можно редактировать вручную.',
      readOnly: false // Разрешаем редактирование
    }),
    defineField({
      name: 'duration',
      title: 'Длительность (секунды)',
      type: 'number',
      validation: (Rule) => Rule.required().min(1).max(300)
    }),
    defineField({
      name: 'tags',
      title: 'Теги',
      type: 'array',
      of: [{ type: 'string' }],
      options: {
        layout: 'tags'
      }
    }),
    defineField({
      name: 'featured',
      title: 'Избранное (показывать на главной)',
      type: 'boolean',
      initialValue: false
    }),
    defineField({
      name: 'publishedAt',
      title: 'Дата публикации',
      type: 'datetime',
      initialValue: () => new Date().toISOString()
    }),
    defineField({
      name: 'viewCount',
      title: 'Количество просмотров',
      type: 'number',
      initialValue: 0
    })
  ],
  preview: {
    select: {
      title: 'title',
      subtitle: 'category'
    }
  },
  orderings: [
    {
      title: 'Дата публикации (новые)',
      name: 'publishedAtDesc',
      by: [{ field: 'publishedAt', direction: 'desc' }]
    },
    {
      title: 'Название (А-Я)',
      name: 'titleAsc',
      by: [{ field: 'title', direction: 'asc' }]
    }
  ]
})


