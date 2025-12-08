/**
 * Sanity Schema: Problem Solution Slides
 * 
 * Отдельная схема для слайдов секции "Проблема/Решение"
 */

import { defineType, defineField } from 'sanity'

export default defineType({
  name: 'problemSolutionSlide',
  title: 'Слайды Карусели',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Заголовок слайда',
      type: 'string',
      description: 'Например: "Видео за 72 часа"',
      validation: Rule => Rule.required()
    }),
    defineField({
      name: 'order',
      title: 'Порядок',
      type: 'number',
      description: 'Порядок отображения слайда (1, 2, 3...)',
      initialValue: 0
    }),
    defineField({
      name: 'images',
      title: 'Изображения для сетки',
      description: 'Загрузите изображения или добавьте ссылки на Cloudinary',
      type: 'array',
      of: [
        // Вариант 1: Загрузка изображения в Sanity
        { 
          type: 'image', 
          options: { hotspot: true },
          title: 'Загрузить изображение' 
        },
        // Вариант 2: Ссылка на внешнее изображение (Cloudinary)
        {
          type: 'object',
          name: 'externalImage',
          title: 'Внешняя ссылка (Cloudinary)',
          fields: [
            {
              name: 'url',
              type: 'url',
              title: 'URL изображения',
              description: 'Прямая ссылка на изображение (например, https://res.cloudinary.com/...)',
              validation: Rule => Rule.required().uri({ scheme: ['http', 'https'] })
            }
          ],
          preview: {
            select: {
              url: 'url'
            },
            prepare({ url }) {
              return {
                title: 'Внешнее изображение',
                subtitle: url,
                media: () => '🔗' // Иконка ссылки
              }
            }
          }
        }
      ]
    })
  ],
  preview: {
    select: {
      title: 'title',
      // Пробуем взять первое изображение, если оно есть (sanity image)
      media: 'images.0'
    },
    prepare({ title, media }) {
      return {
        title: title || 'Новый слайд',
        subtitle: 'Слайд карусели "Проблема/Решение"',
        media: media
      }
    }
  }
})
