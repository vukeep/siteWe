/**
 * Sanity Schema: Pricing Plan (Тарифный план)
 * 
 * Настройки тарифов для секции "Стоимость"
 */

import { defineType, defineField } from 'sanity'

export default defineType({
  name: 'pricingPlan',
  title: 'Тарифные планы',
  type: 'document',
  fields: [
    // ========================================
    // ОСНОВНАЯ ИНФОРМАЦИЯ
    // ========================================
    defineField({
      name: 'name',
      title: '📦 Название пакета',
      type: 'string',
      description: 'Например: Start, Growth, Maximum',
      validation: (Rule) => Rule.required().min(2).max(50),
    }),
    defineField({
      name: 'order',
      title: '🔢 Порядок отображения',
      type: 'number',
      description: 'Чем меньше число, тем левее будет карточка (Start=1, Growth=2, Maximum=3)',
      validation: (Rule) => Rule.required().min(1),
      initialValue: 1,
    }),
    defineField({
      name: 'videoCount',
      title: '🎬 Количество роликов',
      type: 'string',
      description: 'Например: "До 5 роликов"',
      validation: (Rule) => Rule.required(),
      placeholder: 'До 5 роликов',
    }),
    
    // ========================================
    // СТОИМОСТЬ
    // ========================================
    defineField({
      name: 'price',
      title: '💰 Цена (в рублях)',
      type: 'number',
      description: 'Полная стоимость в рублях (например: 100000 для 100 тыс. ₽)',
      validation: (Rule) => Rule.required().min(0).integer(),
      initialValue: 100000,
    }),
    
    // ========================================
    // СРОКИ
    // ========================================
    defineField({
      name: 'duration',
      title: '⏱️ Срок выполнения',
      type: 'string',
      description: 'Например: "3 рабочих дня"',
      validation: (Rule) => Rule.required(),
      placeholder: '3 рабочих дня',
    }),
    
    // ========================================
    // ОСОБЕННОСТИ ПАКЕТА
    // ========================================
    defineField({
      name: 'features',
      title: '✅ Что входит в пакет',
      type: 'array',
      of: [{ type: 'string' }],
      description: 'Список особенностей и преимуществ пакета',
      validation: (Rule) => Rule.required().min(3).max(10),
    }),
    
    // ========================================
    // ДОПОЛНИТЕЛЬНЫЕ НАСТРОЙКИ
    // ========================================
    defineField({
      name: 'recommended',
      title: '⭐ Рекомендуемый пакет',
      type: 'boolean',
      description: 'Пометить как "Популярный" (будет выделен синей рамкой)',
      initialValue: false,
    }),
    defineField({
      name: 'published',
      title: '👁️ Опубликован',
      type: 'boolean',
      description: 'Показывать этот пакет на сайте',
      initialValue: true,
    }),
  ],
  preview: {
    select: {
      title: 'name',
      price: 'price',
      videoCount: 'videoCount',
      recommended: 'recommended',
    },
    prepare({ title, price, videoCount, recommended }) {
      const formattedPrice = (price / 1000).toLocaleString('ru-RU')
      return {
        title: `${recommended ? '⭐ ' : ''}${title}`,
        subtitle: `${videoCount} • ${formattedPrice} тыс. ₽`,
      }
    },
  },
  orderings: [
    {
      title: 'По порядку',
      name: 'orderAsc',
      by: [{ field: 'order', direction: 'asc' }],
    },
    {
      title: 'По цене (возрастание)',
      name: 'priceAsc',
      by: [{ field: 'price', direction: 'asc' }],
    },
    {
      title: 'По цене (убывание)',
      name: 'priceDesc',
      by: [{ field: 'price', direction: 'desc' }],
    },
  ],
})

