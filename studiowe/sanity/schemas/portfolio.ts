/**
 * Sanity Schema: Portfolio
 * 
 * Схема для управления портфолио проектами через Sanity CMS.
 * Видео и постеры хранятся в Cloudinary, здесь только URL.
 */

import { defineType, defineField } from 'sanity'

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
    defineField({
      name: 'videoUrl',
      title: 'URL видео (Cloudinary)',
      type: 'url',
      description: 'Полный URL видео из Cloudinary',
      validation: (Rule) => Rule.required().uri({ scheme: ['https'] })
    }),
    defineField({
      name: 'posterUrl',
      title: 'URL постера (Cloudinary)',
      type: 'url',
      description: 'Полный URL превью из Cloudinary',
      validation: (Rule) => Rule.required().uri({ scheme: ['https'] })
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


