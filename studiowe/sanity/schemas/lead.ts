/**
 * Sanity Schema: Lead
 * 
 * Схема для управления заявками клиентов через Sanity CMS.
 * Все заявки с форм автоматически сохраняются сюда.
 */

import { defineType, defineField } from 'sanity'

export default defineType({
  name: 'lead',
  title: 'Заявки',
  type: 'document',
  fields: [
    defineField({
      name: 'name',
      title: 'Имя',
      type: 'string',
      validation: (Rule) => Rule.required()
    }),
    defineField({
      name: 'company',
      title: 'Компания',
      type: 'string',
      validation: (Rule) => Rule.required()
    }),
    defineField({
      name: 'phone',
      title: 'Телефон',
      type: 'string',
      validation: (Rule) => Rule.required()
    }),
    defineField({
      name: 'email',
      title: 'Email',
      type: 'string',
      validation: (Rule) => Rule.required().email()
    }),
    defineField({
      name: 'task',
      title: 'Задача',
      type: 'text',
      rows: 5,
      validation: (Rule) => Rule.required()
    }),
    defineField({
      name: 'requestType',
      title: 'Тип заявки',
      type: 'string',
      options: {
        list: [
          { title: 'Общая консультация', value: 'general' },
          { title: 'Запрос по портфолио', value: 'portfolio_request' },
          { title: 'Расчет стоимости', value: 'pricing_calculation' }
        ]
      },
      validation: (Rule) => Rule.required()
    }),
    defineField({
      name: 'videoCount',
      title: 'Количество роликов',
      type: 'string',
      description: 'Только для запросов на расчет стоимости'
    }),
    defineField({
      name: 'status',
      title: 'Статус',
      type: 'string',
      options: {
        list: [
          { title: 'Новая', value: 'new' },
          { title: 'В работе', value: 'in_progress' },
          { title: 'Завершена', value: 'completed' }
        ],
        layout: 'radio'
      },
      initialValue: 'new',
      validation: (Rule) => Rule.required()
    }),
    defineField({
      name: 'createdAt',
      title: 'Дата создания',
      type: 'datetime',
      initialValue: () => new Date().toISOString(),
      readOnly: true
    }),
    defineField({
      name: 'notes',
      title: 'Примечания',
      type: 'text',
      rows: 3,
      description: 'Внутренние заметки для команды'
    })
  ],
  preview: {
    select: {
      title: 'name',
      subtitle: 'email',
      description: 'company',
      status: 'status'
    },
    prepare({ title, subtitle, description, status }) {
      const statusEmoji = {
        new: '🆕',
        in_progress: '⏳',
        completed: '✅'
      }[status] || '📝'
      
      return {
        title: `${statusEmoji} ${title}`,
        subtitle,
        description: `${description} | ${status}`
      }
    }
  },
  orderings: [
    {
      title: 'Дата (новые первые)',
      name: 'createdAtDesc',
      by: [{ field: 'createdAt', direction: 'desc' }]
    },
    {
      title: 'Статус',
      name: 'statusAsc',
      by: [{ field: 'status', direction: 'asc' }]
    }
  ]
})


