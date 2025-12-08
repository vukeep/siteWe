import { defineField, defineType } from 'sanity'

export default defineType({
  name: 'siteSettings',
  title: 'Настройки сайта',
  type: 'document',
  fields: [
    defineField({
      name: 'backgroundColor',
      title: 'Основной цвет фона',
      description: 'Цвет фона для всего сайта. Изменение затронет все страницы.',
      type: 'color', // Требует плагин @sanity/color-input
      options: {
        disableAlpha: true,
      }
    }),
    defineField({
      name: 'headingColor',
      title: 'Цвет основных заголовков',
      description: 'Цвет для всех основных заголовков страниц (h1, h2, h3). Градиенты в заголовках будут сохранены.',
      type: 'color', // Требует плагин @sanity/color-input
      options: {
        disableAlpha: true,
      }
    }),
    defineField({
      name: 'title',
      title: 'Название сайта (SEO)',
      type: 'string',
    }),
    defineField({
      name: 'description',
      title: 'Описание сайта (SEO)',
      type: 'text',
      rows: 3,
    }),
  ],
  preview: {
    select: {
      title: 'title',
    },
    prepare(selection) {
      return {
        title: 'Глобальные настройки',
      }
    }
  }
})

