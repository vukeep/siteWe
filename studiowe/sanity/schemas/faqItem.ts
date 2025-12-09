/**
 * Sanity Schema: FAQ Item (Вопрос-ответ)
 * 
 * Элемент списка часто задаваемых вопросов
 */

import { defineType, defineField } from 'sanity'

export default defineType({
  name: 'faqItem',
  title: 'FAQ - Вопросы и ответы',
  type: 'document',
  fields: [
    // ========================================
    // ВОПРОС
    // ========================================
    defineField({
      name: 'question',
      title: '❓ Вопрос',
      type: 'string',
      description: 'Короткий и понятный вопрос',
      validation: (Rule) => Rule.required().min(10).max(200),
      placeholder: 'Будут ли ролики в едином стиле?',
    }),
    
    // ========================================
    // ОТВЕТ
    // ========================================
    defineField({
      name: 'answer',
      title: '💬 Ответ',
      type: 'text',
      description: 'Подробный ответ на вопрос',
      validation: (Rule) => Rule.required().min(20).max(1000),
      rows: 5,
    }),
    
    // ========================================
    // ПОРЯДОК И ПУБЛИКАЦИЯ
    // ========================================
    defineField({
      name: 'order',
      title: '🔢 Порядок отображения',
      type: 'number',
      description: 'Чем меньше число, тем выше в списке',
      validation: (Rule) => Rule.required().min(1),
      initialValue: 1,
    }),
    defineField({
      name: 'published',
      title: '👁️ Опубликован',
      type: 'boolean',
      description: 'Показывать этот вопрос на сайте',
      initialValue: true,
    }),
  ],
  preview: {
    select: {
      question: 'question',
      order: 'order',
      published: 'published',
    },
    prepare({ question, order, published }) {
      return {
        title: `${published ? '✓' : '✗'} ${question}`,
        subtitle: `Порядок: ${order}`,
      }
    },
  },
  orderings: [
    {
      title: 'По порядку',
      name: 'orderAsc',
      by: [{ field: 'order', direction: 'asc' }],
    },
  ],
})

