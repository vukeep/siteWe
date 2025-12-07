/**
 * Sanity Webhook Handler
 * 
 * API route для обработки webhooks от Sanity CMS.
 * Автоматически ревалидирует страницы при изменении контента.
 * 
 * Workflow:
 * 1. Sanity отправляет webhook при изменении документа
 * 2. Проверяем подпись для безопасности
 * 3. Определяем тип документа и slug
 * 4. Ревалидируем соответствующие страницы через ISR
 * 
 * Setup в Sanity Dashboard:
 * - URL: https://studiowe.com/api/sanity-webhook
 * - Triggers: portfolio (create, update, delete)
 * - Secret: SANITY_WEBHOOK_SECRET (из env)
 */

import { revalidatePath, revalidateTag } from 'next/cache'
import { NextRequest, NextResponse } from 'next/server'

const webhookSecret = process.env.SANITY_WEBHOOK_SECRET

/**
 * Обработчик POST запросов от Sanity webhook
 */
export async function POST(request: NextRequest) {
  try {
    // DEBUG: Логируем все данные для отладки
    console.log('\n🔍 === WEBHOOK DEBUG ===')
    console.log('📍 URL:', request.url)
    console.log('🔑 Expected secret (env):', webhookSecret ? `${webhookSecret.substring(0, 8)}...` : '❌ НЕ ЗАДАН')
    
    // Получаем body как текст для проверки подписи
    const body = await request.text()
    
    // Простая проверка секрета через query параметр или header
    // (Для production рекомендуется использовать @sanity/webhook с HMAC)
    const secretFromQuery = request.nextUrl.searchParams.get('secret')
    const secretFromHeader = request.headers.get('x-sanity-webhook-secret')
    
    console.log('🔑 Secret from query:', secretFromQuery ? `${secretFromQuery.substring(0, 8)}...` : '❌ Отсутствует')
    console.log('🔑 Secret from header:', secretFromHeader ? `${secretFromHeader.substring(0, 8)}...` : '❌ Отсутствует')
    console.log('✅ Match query:', secretFromQuery === webhookSecret)
    console.log('✅ Match header:', secretFromHeader === webhookSecret)
    console.log('===================\n')
    
    if (secretFromQuery !== webhookSecret && secretFromHeader !== webhookSecret) {
      console.error('❌ Webhook: Invalid secret')
      return NextResponse.json(
        { message: 'Invalid webhook secret' },
        { status: 401 }
      )
    }

    // Парсим payload
    const payload = JSON.parse(body)
    const { _type, slug } = payload
    
    console.log(`📥 Webhook received: ${_type}`, slug)

    // Обработка портфолио
    if (_type === 'portfolio') {
      const portfolioSlug = slug?.current
      
      // Ревалидируем конкретную страницу проекта
      if (portfolioSlug) {
        revalidatePath(`/portfolio/${portfolioSlug}`, 'page')
        console.log(`✅ Revalidated: /portfolio/${portfolioSlug}`)
      }
      
      // Ревалидируем списки портфолио
      revalidatePath('/portfolio', 'page')
      console.log('✅ Revalidated: /portfolio')
      
      // Ревалидируем главную страницу (featured projects)
      revalidatePath('/', 'page')
      console.log('✅ Revalidated: /')
      
      // Ревалидируем sitemap
      revalidatePath('/sitemap.xml', 'page')
      console.log('✅ Revalidated: /sitemap.xml')
      
      return NextResponse.json({
        revalidated: true,
        now: Date.now(),
        paths: ['/', '/portfolio', `/portfolio/${portfolioSlug || 'all'}`, '/sitemap.xml']
      })
    }

    // Обработка заявок (leads) - можно добавить логику если нужно
    if (_type === 'lead') {
      console.log('📝 New lead received (no revalidation needed)')
      return NextResponse.json({
        received: true,
        now: Date.now()
      })
    }

    // Неизвестный тип документа
    console.log(`⚠️ Unknown document type: ${_type}`)
    return NextResponse.json({
      message: 'Unknown document type',
      type: _type
    })

  } catch (error) {
    console.error('❌ Webhook error:', error)
    return NextResponse.json(
      {
        message: 'Webhook processing failed',
        error: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}

/**
 * GET handler для проверки работоспособности webhook endpoint
 */
export async function GET() {
  return NextResponse.json({
    message: 'Sanity webhook endpoint is working',
    timestamp: new Date().toISOString()
  })
}


