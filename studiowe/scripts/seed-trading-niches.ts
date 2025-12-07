/**
 * Seed Script: Trading Niches
 * 
 * Создает начальные данные для блока "Какие ролики мы создаем"
 * Загружает 6 торговых ниш в Sanity CMS
 * 
 * Запуск:
 * npm run seed-niches
 */

import dotenv from 'dotenv'
import path from 'path'

// Загружаем .env.local
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') })

// Импорт данных
import { tradingNichesMockData } from '../src/lib/data/trading-niches-mock.js'

/**
 * Оптимизирует URL из Cloudinary
 */
function getOptimizedMediaUrl(baseUrl: string, isVideo: boolean): string {
  if (!baseUrl.includes('res.cloudinary.com')) {
    return baseUrl // Если не Cloudinary, возвращаем как есть
  }

  const transformations = isVideo 
    ? 'f_auto,q_auto' // Для видео
    : 'f_auto,q_auto,w_800,h_600,c_fill' // Для изображений

  return baseUrl.replace('/upload/', `/upload/${transformations}/`)
}

/**
 * Генерирует постер для видео
 */
function getVideoPosterUrl(videoUrl: string): string {
  if (!videoUrl.includes('res.cloudinary.com')) {
    return videoUrl
  }

  return videoUrl.replace('/upload/', '/upload/so_0,f_webp,q_auto/')
    .replace(/\.(mp4|mov|avi)$/i, '.webp')
}

/**
 * Основная функция миграции
 */
async function seedNiches() {
  console.log('\n' + '='.repeat(60))
  console.log('🎯 SEED: Торговые ниши')
  console.log('='.repeat(60) + '\n')

  // Проверка переменных окружения
  if (!process.env.NEXT_PUBLIC_SANITY_PROJECT_ID) {
    console.error('❌ Ошибка: NEXT_PUBLIC_SANITY_PROJECT_ID не установлен')
    console.error('Убедитесь что файл .env.local существует и содержит все необходимые переменные\n')
    process.exit(1)
  }

  try {
    // Динамический импорт ПОСЛЕ загрузки .env
    const { serverClient } = await import('../sanity/lib/server-client.js')

    console.log(`📦 Загружаем ${tradingNichesMockData.length} торговых ниш...\n`)

    let successCount = 0
    let errorCount = 0

    for (const niche of tradingNichesMockData) {
      try {
        // Генерируем оптимизированный URL
        const isVideo = niche.mediaType === 'video'
        const optimizedUrl = getOptimizedMediaUrl(niche.cloudinaryBaseUrl, isVideo)
        const posterUrl = isVideo ? getVideoPosterUrl(niche.cloudinaryBaseUrl) : undefined

        // Формируем документ для Sanity
        const doc = {
          _type: 'tradingNiches',
          title: niche.title,
          icon: niche.icon,
          slug: {
            _type: 'slug',
            current: niche.slug
          },
          description: niche.description,
          order: niche.order,
          subcategories: niche.subcategories,
          mediaType: niche.mediaType,
          cloudinaryBaseUrl: niche.cloudinaryBaseUrl,
          optimizedMediaUrl: optimizedUrl,
          posterUrl: posterUrl,
          videoAutoplay: niche.videoAutoplay ?? true,
          videoLoop: niche.videoLoop ?? true,
          videoMuted: niche.videoMuted ?? true,
          published: niche.published,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        }

        // Создаем документ в Sanity
        const result = await serverClient.create(doc)
        
        console.log(`✅ Создано: ${niche.icon} ${niche.title}`)
        console.log(`   ID: ${result._id}`)
        console.log(`   Порядок: #${niche.order}`)
        console.log(`   Тип: ${niche.mediaType === 'video' ? '🎥 Видео' : '🖼️ Изображение'}`)
        console.log(`   Подкатегорий: ${niche.subcategories.length}`)
        console.log(`   Статус: ${niche.published ? '✅ Опубликовано' : '❌ Скрыто'}\n`)
        
        successCount++
      } catch (error: any) {
        // Проверяем если документ уже существует
        if (error.message?.includes('already exists')) {
          console.log(`⚠️  Пропущено: ${niche.icon} ${niche.title} (уже существует)\n`)
        } else {
          console.error(`❌ Ошибка при создании "${niche.title}":`, error.message || error)
          errorCount++
        }
      }
    }

    // Итоговая статистика
    console.log('\n' + '='.repeat(60))
    console.log('📈 Seed завершен!')
    console.log('='.repeat(60))
    console.log(`✅ Успешно создано: ${successCount}`)
    console.log(`❌ Ошибок: ${errorCount}`)
    console.log(`📊 Всего обработано: ${successCount + errorCount}`)
    console.log('='.repeat(60) + '\n')

    if (successCount > 0) {
      console.log('🎉 Торговые ниши успешно добавлены в Sanity CMS!')
      console.log(`\n📝 Следующие шаги:`)
      console.log(`1. Проверьте данные в Sanity Studio: http://localhost:3000/admin`)
      console.log(`2. Перейдите в раздел "Торговые ниши"`)
      console.log(`3. Обновите главную страницу сайта: http://localhost:3000`)
      console.log(`4. Блок "Какие ролики мы создаем" должен заработать!\n`)
    }

    if (errorCount > 0) {
      console.log(`\n⚠️  Внимание: При создании ${errorCount} ниш возникли ошибки`)
      console.log(`Проверьте логи выше для деталей\n`)
    }

  } catch (error) {
    console.error('\n❌ Критическая ошибка при seed:', error)
    console.error('\nПроверьте:')
    console.error('1. Запущен ли dev сервер (npm run dev)')
    console.error('2. Корректны ли переменные окружения в .env.local')
    console.error('3. Доступен ли Sanity API\n')
    process.exit(1)
  }
}

// Запуск
seedNiches()
  .then(() => {
    console.log('✨ Готово!\n')
    process.exit(0)
  })
  .catch((error) => {
    console.error('💥 Непредвиденная ошибка:', error)
    process.exit(1)
  })

