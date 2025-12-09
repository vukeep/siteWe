/**
 * Sanity Studio Configuration
 * 
 * Конфигурация Sanity Studio, встроенного в Next.js на маршруте /admin.
 * Содержит настройки проекта, плагины и схемы данных.
 */

import { defineConfig } from 'sanity'
import { structureTool } from 'sanity/structure'
import { visionTool } from '@sanity/vision'
import { colorInput } from '@sanity/color-input'
import schemas from './schemas'
import { revalidateHomepageAction } from './actions/revalidateHomepage'
import { revalidateSiteSettingsAction } from './actions/revalidateSiteSettings'

// Environment переменные
const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET!

export default defineConfig({
  name: 'studiowe',
  title: 'StudioWe CMS',
  projectId,
  dataset,
  basePath: '/admin',
  
  plugins: [
    structureTool({
      structure: (S) =>
        S.list()
          .title('Контент')
          .items([
            // Глобальные настройки (singleton)
            S.listItem()
              .title('Настройки сайта')
              .icon(() => '⚙️')
              .child(
                S.document()
                  .schemaType('siteSettings')
                  .documentId('siteSettings')
                  .title('Глобальные настройки')
              ),

            S.divider(),

            // Главная страница (singleton - один документ)
            S.listItem()
              .title('Главная страница')
              .icon(() => '🏠')
              .child(
                S.document()
                  .schemaType('homepage')
                  .documentId('homepage') // Фиксированный ID для singleton
                  .title('Настройки Главной Страницы')
              ),
            
            S.divider(),
            
            // Слайды Проблема/Решение
            S.listItem()
              .title('Слайды карусели')
              .icon(() => '🧩')
              .child(
                S.documentTypeList('problemSolutionSlide')
                  .title('Слайды карусели')
                  .defaultOrdering([{ field: 'order', direction: 'asc' }])
              ),

            S.divider(),

            // Торговые ниши (блок "Какие ролики мы создаем")
            S.listItem()
              .title('Торговые ниши')
              .icon(() => '🎯')
              .child(
                S.documentTypeList('tradingNiches')
                  .title('Форматы роликов')
                  .defaultOrdering([{ field: 'order', direction: 'asc' }])
              ),

            S.divider(),

            // Тарифы
            S.listItem()
              .title('Тарифы')
              .icon(() => '💰')
              .child(
                S.list()
                  .title('Управление тарифами')
                  .items([
                    // Настройки секции тарифов (singleton)
                    S.listItem()
                      .title('Настройки секции "Стоимость"')
                      .icon(() => '⚙️')
                      .child(
                        S.document()
                          .schemaType('pricingSettings')
                          .documentId('pricingSettings')
                          .title('Настройки секции тарифов')
                      ),
                    
                    S.divider(),

                    // Тарифные планы (список)
                    S.listItem()
                      .title('Тарифные планы')
                      .icon(() => '📦')
                      .child(
                        S.documentTypeList('pricingPlan')
                          .title('Тарифные планы')
                          .defaultOrdering([{ field: 'order', direction: 'asc' }])
                      ),
                  ])
              ),
            
            S.divider(),

            // FAQ - Часто задаваемые вопросы
            S.listItem()
              .title('❓ FAQ')
              .icon(() => '❓')
              .child(
                S.list()
                  .title('Управление FAQ')
                  .items([
                    // Настройки секции FAQ (singleton)
                    S.listItem()
                      .title('Настройки секции FAQ')
                      .icon(() => '⚙️')
                      .child(
                        S.document()
                          .schemaType('faqSettings')
                          .documentId('faqSettings')
                          .title('Настройки секции FAQ')
                      ),
                    
                    S.divider(),

                    // FAQ элементы (список)
                    S.listItem()
                      .title('Вопросы и ответы')
                      .icon(() => '💬')
                      .child(
                        S.documentTypeList('faqItem')
                          .title('Вопросы и ответы')
                          .defaultOrdering([{ field: 'order', direction: 'asc' }])
                      ),
                  ])
              ),

            S.divider(),

            // Портфолио
            S.listItem()
              .title('Портфолио')
              .icon(() => '🎬')
              .child(
                S.documentTypeList('portfolio')
                  .title('Проекты')
                  .defaultOrdering([{ field: 'publishedAt', direction: 'desc' }])
              ),
            
            // Заявки
            S.listItem()
              .title('Заявки')
              .icon(() => '📝')
              .child(
                S.documentTypeList('lead')
                  .title('Заявки клиентов')
                  .defaultOrdering([{ field: 'createdAt', direction: 'desc' }])
              ),
          ])
    }),
    
    // Плагин для выбора цвета
    colorInput(),

    // Vision plugin для тестирования GROQ запросов
    visionTool()
  ],
  
  schema: {
    types: schemas
  },

  // Кастомные действия для документов
  document: {
    actions: (prev, context) => {
      // Добавляем действие "Обновить Главную" для homepage
      if (context.schemaType === 'homepage') {
        return [...prev, revalidateHomepageAction]
      }
      // Добавляем действие "Обновить настройки" для siteSettings
      if (context.schemaType === 'siteSettings') {
        return [...prev, revalidateSiteSettingsAction]
      }
      return prev
    }
  }
})
