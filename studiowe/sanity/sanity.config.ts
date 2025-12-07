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
            // Главная страница (singleton)
            S.listItem()
              .title('🏠 Главная страница')
              .icon(() => '🏠')
              .child(
                S.document()
                  .schemaType('homepage')
                  .documentId('homepage-settings')
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
    
    // Vision plugin для тестирования GROQ запросов
    visionTool()
  ],
  
  schema: {
    types: schemas
  }
})


