/**
 * Sanity Studio Configuration
 * 
 * Конфигурация Sanity Studio, встроенного в Next.js на маршруте /admin.
 * Содержит настройки проекта, плагины и схемы данных.
 */

import { defineConfig } from 'sanity'
import { structureTool } from 'sanity/structure'
import { visionTool } from '@sanity/vision'
import schemas from './schemas'
import { revalidateHomepageAction } from './actions/revalidateHomepage'

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
            
            // Торговые ниши (блок "Какие ролики мы создаем")
            S.listItem()
              .title('Торговые ниши')
              .icon(() => '🎯')
              .child(
                S.documentTypeList('tradingNiches')
                  .title('Форматы роликов')
                  .defaultOrdering([{ field: 'order', direction: 'asc' }])
              ),
            
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
      return prev
    }
  }
})


