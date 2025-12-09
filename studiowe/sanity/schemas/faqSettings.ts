/**
 * Sanity Schema: FAQ Settings (Настройки секции FAQ)
 * 
 * Singleton документ для управления настройками секции "Частые вопросы"
 */

import { defineType, defineField } from 'sanity'

export default defineType({
  name: 'faqSettings',
  title: 'Настройки секции FAQ',
  type: 'document',
  fields: [
    // ========================================
    // ЗАГОЛОВКИ
    // ========================================
    defineField({
      name: 'title',
      title: '📋 Заголовок секции',
      type: 'string',
      description: 'Основной заголовок секции FAQ',
      initialValue: 'Частые вопросы',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'subtitle',
      title: '📝 Подзаголовок',
      type: 'text',
      description: 'Описание под заголовком',
      initialValue: 'Ответы на популярные вопросы о работе с AI-видеопродакшном',
      validation: (Rule) => Rule.required().max(200),
    }),
    
    // ========================================
    // CTA БЛОК
    // ========================================
    defineField({
      name: 'ctaText',
      title: '💬 Текст над кнопкой CTA',
      type: 'string',
      initialValue: 'Не нашли ответ на свой вопрос?',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'ctaButtonText',
      title: '🔘 Текст кнопки CTA',
      type: 'string',
      initialValue: 'Задать вопрос',
      validation: (Rule) => Rule.required(),
    }),
    
    // ========================================
    // МЕТА
    // ========================================
    defineField({
      name: 'lastModified',
      title: 'Последнее изменение',
      type: 'datetime',
      readOnly: true,
      initialValue: () => new Date().toISOString(),
    }),
  ],
  preview: {
    prepare() {
      return {
        title: '❓ Настройки секции FAQ',
        subtitle: 'Заголовки, тексты, CTA',
      }
    },
  },
})

