import { NextRequest, NextResponse } from 'next/server'
import { revalidatePath } from 'next/cache'

/**
 * API Route для ISR (Incremental Static Regeneration)
 * 
 * POST /api/revalidate
 * 
 * Webhook endpoint для Payload CMS для триггера обновления
 * статически сгенерированных страниц при изменении контента
 * 
 * Требует secret token для безопасности
 * 
 * Примеры использования:
 * - Обновление главной страницы при изменении hero блока
 * - Обновление портфолио при добавлении нового кейса
 * - Обновление тарифов при изменении цен
 */

export async function POST(request: NextRequest) {
  try {
    // Проверка secret token для безопасности
    const secret = request.nextUrl.searchParams.get('secret')
    const expectedSecret = process.env.REVALIDATE_SECRET || 'your-secret-token'

    if (secret !== expectedSecret) {
      return NextResponse.json(
        { success: false, message: 'Invalid token' },
        { status: 401 }
      )
    }

    // Парсинг тела запроса
    const body = await request.json()
    const { path, tag, collection } = body

    console.log('[REVALIDATE] Запрос на revalidation:', { path, tag, collection })

    // Revalidation по пути
    if (path) {
      revalidatePath(path)
      console.log(`[REVALIDATE] Обновлен путь: ${path}`)
    }

    // Revalidation по тегу (закомментировано для Next.js 16 совместимости)
    if (tag) {
      // TODO: Добавить поддержку revalidateTag когда определим правильную сигнатуру
      console.log(`[REVALIDATE] Запрошен тег: ${tag} (не реализовано)`)
    }

    // Revalidation по коллекции Payload CMS
    if (collection) {
      await handleCollectionRevalidation(collection)
    }

    return NextResponse.json(
      {
        success: true,
        message: 'Revalidation успешно выполнен',
        revalidated: { path, tag, collection },
        timestamp: new Date().toISOString(),
      },
      { status: 200 }
    )
  } catch (error) {
    console.error('[REVALIDATE] Ошибка:', error)

    return NextResponse.json(
      {
        success: false,
        message: 'Ошибка при revalidation',
        error: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    )
  }
}

/**
 * Обработка revalidation для различных коллекций Payload CMS
 */
function handleCollectionRevalidation(collection: string): void {
  switch (collection) {
    case 'portfolio-items':
      // Обновить главную (галерея) и страницу портфолио
      revalidatePath('/')
      revalidatePath('/portfolio')
      console.log('[REVALIDATE] Обновлено портфолио')
      break

    case 'pricing-packages':
      // Обновить главную (секция тарифов)
      revalidatePath('/')
      console.log('[REVALIDATE] Обновлены тарифы')
      break

    case 'faq':
      // Обновить главную (FAQ секция)
      revalidatePath('/')
      console.log('[REVALIDATE] Обновлен FAQ')
      break

    case 'settings':
      // Обновить все страницы (глобальные настройки)
      revalidatePath('/', 'layout')
      console.log('[REVALIDATE] Обновлены глобальные настройки')
      break

    default:
      // Общий revalidation главной страницы
      revalidatePath('/')
      console.log(`[REVALIDATE] Обновлена главная для коллекции: ${collection}`)
  }
}

/**
 * GET метод для проверки здоровья endpoint
 */
export async function GET() {
  return NextResponse.json({
    status: 'ok',
    service: 'revalidation-api',
    version: '1.0.0',
    timestamp: new Date().toISOString(),
  })
}

