/**
 * Migration Script: Portfolio Mock Data → Sanity CMS
 * 
 * Скрипт для переноса mock данных портфолио в Sanity CMS.
 * 
 * Запуск:
 * ```bash
 * npm run migrate
 * ```
 * 
 * Требования:
 * - NEXT_PUBLIC_SANITY_PROJECT_ID в .env.local
 * - NEXT_PUBLIC_SANITY_DATASET в .env.local
 * - SANITY_API_TOKEN в .env.local (с правами записи)
 */

// Загрузка environment variables из .env.local
import { config } from 'dotenv'
import { resolve } from 'path'
import { existsSync } from 'fs'

// Загружаем .env.local из корня проекта ПЕРЕД любыми импортами
const envPath = resolve(__dirname, '../.env.local')
const result = config({ path: envPath })

console.log(`\n📂 Путь к .env.local: ${envPath}`)
console.log(`📂 Файл существует: ${existsSync(envPath) ? '✅ Да' : '❌ Нет'}`)

if (result.error) {
  console.error('❌ Ошибка загрузки .env.local:', result.error)
  console.error('\n⚠️ Убедитесь, что файл .env.local существует и содержит:')
  console.error('   - NEXT_PUBLIC_SANITY_PROJECT_ID=g1vps1f0')
  console.error('   - NEXT_PUBLIC_SANITY_DATASET=production')
  console.error('   - SANITY_API_TOKEN=ваш_токен\n')
  process.exit(1)
}

console.log('✅ .env.local загружен\n')

// DEBUG: Проверяем переменные
console.log('🔍 Environment Variables:')
console.log(`   PROJECT_ID: ${process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || '❌ НЕ ЗАДАН'}`)
console.log(`   DATASET: ${process.env.NEXT_PUBLIC_SANITY_DATASET || '❌ НЕ ЗАДАН'}`)
console.log(`   API_TOKEN: ${process.env.SANITY_API_TOKEN ? '✅ Задан (длина: ' + process.env.SANITY_API_TOKEN.length + ' символов)' : '❌ НЕ ЗАДАН'}`)
console.log('')

// Проверка обязательных переменных
const requiredVars = {
  'NEXT_PUBLIC_SANITY_PROJECT_ID': process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  'NEXT_PUBLIC_SANITY_DATASET': process.env.NEXT_PUBLIC_SANITY_DATASET,
  'SANITY_API_TOKEN': process.env.SANITY_API_TOKEN
}

const missing = Object.entries(requiredVars).filter(([_, value]) => !value).map(([key]) => key)

if (missing.length > 0) {
  console.error('❌ Отсутствуют обязательные переменные:\n')
  missing.forEach(varName => console.error(`   - ${varName}`))
  console.error('\n📝 Откройте .env.local и добавьте эти переменные!\n')
  process.exit(1)
}

/**
 * Основная функция миграции
 */
async function migrate() {
  // Динамический импорт ПОСЛЕ загрузки .env
  const { serverClient } = await import('../sanity/lib/server-client.js')
  const { portfolioMockData } = await import('../src/lib/data/portfolio-mock.js')
  
  console.log('🚀 Начинаем миграцию портфолио в Sanity CMS...\n')
  console.log(`📊 Найдено проектов для миграции: ${portfolioMockData.length}\n`)

  let successCount = 0
  let errorCount = 0

  for (const item of portfolioMockData) {
    try {
      // Формируем документ для Sanity
      const doc = {
        _type: 'portfolio',
        title: item.title,
        slug: {
          _type: 'slug',
          current: item.slug
        },
        description: item.description,
        category: item.category,
        videoUrl: item.videoUrl,
        posterUrl: item.posterUrl,
        duration: item.duration,
        tags: item.tags,
        featured: item.featured,
        publishedAt: item.publishedAt.toISOString(),
        viewCount: item.viewCount || 0
      }

      // Создаем документ в Sanity
      const result = await serverClient.create(doc)
      
      console.log(`✅ Создан: ${item.title}`)
      console.log(`   ID: ${result._id}`)
      console.log(`   Slug: ${item.slug}`)
      console.log(`   Featured: ${item.featured ? 'Да' : 'Нет'}\n`)
      
      successCount++
    } catch (error) {
      console.error(`❌ Ошибка при создании "${item.title}":`, error)
      errorCount++
    }
  }

  // Итоговая статистика
  console.log('\n' + '='.repeat(60))
  console.log('📈 Миграция завершена!')
  console.log('='.repeat(60))
  console.log(`✅ Успешно создано: ${successCount}`)
  console.log(`❌ Ошибок: ${errorCount}`)
  console.log(`📊 Всего обработано: ${successCount + errorCount}`)
  console.log('='.repeat(60) + '\n')

  if (successCount > 0) {
    console.log('🎉 Данные успешно перенесены в Sanity CMS!')
    console.log(`\n📝 Следующие шаги:`)
    console.log(`1. Проверьте данные в Sanity Studio: http://localhost:3000/admin`)
    console.log(`2. Убедитесь, что все проекты отображаются корректно`)
    console.log(`3. После проверки можно удалить portfolio-mock.ts`)
  }

  if (errorCount > 0) {
    console.log('\n⚠️ Внимание: Некоторые проекты не были перенесены.')
    console.log('Проверьте ошибки выше и повторите миграцию для failed items.')
  }
}


/**
 * Запуск миграции с обработкой ошибок
 */
async function main() {
  console.clear()
  console.log('=' + '='.repeat(60) + '=')
  console.log(' '.repeat(15) + 'МИГРАЦИЯ ДАННЫХ В SANITY CMS')
  console.log('=' + '='.repeat(60) + '=\n')

  try {
    await migrate()
  } catch (error) {
    console.error('\n❌ Критическая ошибка при миграции:', error)
    process.exit(1)
  }
}

// Запуск
main()


