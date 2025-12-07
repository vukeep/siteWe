/**
 * Sanity Schema: Trading Niches (Торговые ниши)
 * 
 * Управление блоком "Какие ролики мы создаем" с видео/изображениями
 * Каждая ниша содержит:
 * - Название и иконку
 * - Список подкатегорий
 * - Видео или изображение (через Cloudinary)
 * - Описание
 */

import { defineType, defineField, defineArrayMember } from 'sanity'
import { CloudinaryVideoInput } from '../components/CloudinaryVideoInput'

export default defineType({
  name: 'tradingNiches',
  title: 'Торговые ниши',
  type: 'document',
  liveEdit: true, // Изменения применяются сразу
  fields: [
    // ========================================
    // ОСНОВНАЯ ИНФОРМАЦИЯ
    // ========================================
    defineField({
      name: 'title',
      title: '📝 Название ниши',
      type: 'string',
      description: 'Например: "Маркетинг и продажи"',
      validation: (Rule) => Rule.required().max(50)
    }),

    defineField({
      name: 'icon',
      title: '🎨 Иконка',
      type: 'string',
      description: '✨ Emoji иконка для визуального оформления (например: 📈, 🛒, 🎓)',
      validation: (Rule) => Rule.required().max(2),
      initialValue: '📈'
    }),

    defineField({
      name: 'slug',
      title: '🔗 URL Slug',
      type: 'slug',
      description: 'Автоматически создается из названия. Используется для идентификации.',
      options: {
        source: 'title',
        maxLength: 96,
      },
      validation: (Rule) => Rule.required()
    }),

    defineField({
      name: 'description',
      title: '📄 Краткое описание',
      type: 'text',
      description: 'Отображается под изображением в sticky блоке',
      rows: 2,
      validation: (Rule) => Rule.required().max(150)
    }),

    defineField({
      name: 'order',
      title: '🔢 Порядок отображения',
      type: 'number',
      description: 'Чем меньше число, тем выше в списке (1, 2, 3...)',
      validation: (Rule) => Rule.required().min(1),
      initialValue: 1
    }),

    // ========================================
    // ПОДКАТЕГОРИИ
    // ========================================
    defineField({
      name: 'subcategories',
      title: '📋 Подкатегории',
      type: 'array',
      description: 'Список услуг/форматов в этой нише',
      of: [
        defineArrayMember({
          type: 'string',
        })
      ],
      validation: (Rule) => Rule.required().min(1).max(6)
    }),

    // ========================================
    // МЕДИА КОНТЕНТ (ВИДЕО ИЛИ ИЗОБРАЖЕНИЕ)
    // ========================================
    defineField({
      name: 'mediaType',
      title: '🎬 Тип медиа',
      type: 'string',
      description: 'Выберите что показывать: видео или статичное изображение',
      options: {
        list: [
          { title: '🎥 Видео', value: 'video' },
          { title: '🖼️ Изображение', value: 'image' }
        ],
        layout: 'radio'
      },
      initialValue: 'image',
      validation: (Rule) => Rule.required()
    }),

    // Базовый URL из Cloudinary
    defineField({
      name: 'cloudinaryBaseUrl',
      title: '📹 Исходный URL (Cloudinary)',
      type: 'string',
      description: '🔗 Вставьте базовый URL видео или изображения из Cloudinary. Оптимизированные версии создадутся автоматически.',
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

    // Оптимизированный URL (видео или изображение)
    defineField({
      name: 'optimizedMediaUrl',
      title: '✨ Оптимизированное медиа',
      type: 'string',
      description: '✨ Автоматически генерируется из исходного URL. Можно редактировать вручную.',
      readOnly: false
    }),

    // Постер для видео
    defineField({
      name: 'posterUrl',
      title: '🖼️ Постер (для видео)',
      type: 'string',
      description: '✨ Автоматически генерируется для видео. Первый кадр или можно указать свой.',
      readOnly: false,
      hidden: ({ document }) => document?.mediaType !== 'video'
    }),

    // ========================================
    // НАСТРОЙКИ ВИДЕО (если выбрано видео)
    // ========================================
    defineField({
      name: 'videoAutoplay',
      title: '▶️ Автозапуск видео',
      type: 'boolean',
      description: 'Автоматически запускать видео при активации тезиса',
      initialValue: true,
      hidden: ({ document }) => document?.mediaType !== 'video'
    }),

    defineField({
      name: 'videoLoop',
      title: '🔁 Зациклить видео',
      type: 'boolean',
      description: 'Повторять видео после окончания',
      initialValue: true,
      hidden: ({ document }) => document?.mediaType !== 'video'
    }),

    defineField({
      name: 'videoMuted',
      title: '🔇 Без звука',
      type: 'boolean',
      description: 'Запускать видео без звука (рекомендуется)',
      initialValue: true,
      hidden: ({ document }) => document?.mediaType !== 'video'
    }),

    // ========================================
    // ПУБЛИКАЦИЯ
    // ========================================
    defineField({
      name: 'published',
      title: '✅ Опубликовано',
      type: 'boolean',
      description: 'Отображать эту нишу на сайте',
      initialValue: true
    }),

    // ========================================
    // СЛУЖЕБНЫЕ ПОЛЯ
    // ========================================
    defineField({
      name: 'createdAt',
      title: 'Дата создания',
      type: 'datetime',
      readOnly: true,
      initialValue: () => new Date().toISOString()
    }),

    defineField({
      name: 'updatedAt',
      title: 'Последнее изменение',
      type: 'datetime',
      readOnly: true
    })
  ],

  preview: {
    select: {
      title: 'title',
      icon: 'icon',
      order: 'order',
      published: 'published',
      mediaType: 'mediaType',
      media: 'optimizedMediaUrl'
    },
    prepare({ title, icon, order, published, mediaType }) {
      return {
        title: `${icon} ${title}`,
        subtitle: `#${order} • ${mediaType === 'video' ? '🎥 Видео' : '🖼️ Изображение'} • ${published ? '✅ Опубликовано' : '❌ Скрыто'}`,
      }
    }
  },

  orderings: [
    {
      title: 'По порядку отображения',
      name: 'orderAsc',
      by: [
        { field: 'order', direction: 'asc' }
      ]
    },
    {
      title: 'По дате создания',
      name: 'createdAtDesc',
      by: [
        { field: 'createdAt', direction: 'desc' }
      ]
    }
  ]
})

