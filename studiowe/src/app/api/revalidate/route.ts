/**
 * API Route: On-Demand Revalidation
 * 
 * Принудительная ревалидация кэша Next.js для обновления данных из Sanity.
 * Используется для немедленного обновления контента после изменений в CMS.
 * 
 * Производительность: Ревалидация происходит в фоновом режиме
 * Безопасность: Требуется секретный токен для авторизации
 * 
 * @see https://nextjs.org/docs/app/building-your-application/data-fetching/incremental-static-regeneration#on-demand-revalidation
 */

import { revalidateTag, revalidatePath } from 'next/cache'
import { NextRequest, NextResponse } from 'next/server'

/**
 * POST /api/revalidate
 * 
 * Ревалидирует указанные tags или paths
 * 
 * Body параметры:
 * - secret: Секретный токен (обязательный)
 * - tag?: Тег для ревалидации (homepage, portfolio, lead)
 * - path?: Путь для ревалидации (/,/portfolio, etc.)
 * 
 * @example
 * ```bash
 * # Ревалидация homepage
 * curl -X POST http://localhost:3000/api/revalidate \
 *   -H "Content-Type: application/json" \
 *   -d '{"secret":"dev-secret","tag":"homepage"}'
 * 
 * # Ревалидация главной страницы
 * curl -X POST http://localhost:3000/api/revalidate \
 *   -H "Content-Type: application/json" \
 *   -d '{"secret":"dev-secret","path":"/"}'
 * ```
 */
export async function POST(request: NextRequest) {
  try {
    // Получаем body запроса
    const body = await request.json()
    const { secret, tag, path } = body

    // Проверка секретного токена
    // В production используйте безопасный токен из .env
    const validSecret = process.env.NEXT_REVALIDATE_SECRET || process.env.REVALIDATE_SECRET || 'dev-secret'
    
    if (secret !== validSecret) {
      return NextResponse.json(
        { 
          success: false, 
          error: '❌ Invalid secret token' 
        },
        { status: 401 }
      )
    }

    // Ревалидация по тегу (рекомендуется)
    if (tag) {
      // В Next.js 16+ revalidateTag требует второй аргумент - профиль кэширования
      // 'max' - максимальное время жизни кэша
      revalidateTag(tag, 'max')
      console.log(`✅ Revalidated tag: ${tag}`)
      
      return NextResponse.json({
        success: true,
        message: `✅ Tag "${tag}" revalidated successfully`,
        revalidated: true,
        now: Date.now()
      })
    }

    // Ревалидация по пути
    if (path) {
      revalidatePath(path)
      console.log(`✅ Revalidated path: ${path}`)
      
      return NextResponse.json({
        success: true,
        message: `✅ Path "${path}" revalidated successfully`,
        revalidated: true,
        now: Date.now()
      })
    }

    // Если не указаны ни tag ни path
    return NextResponse.json(
      { 
        success: false, 
        error: '⚠️ Please provide either "tag" or "path" parameter' 
      },
      { status: 400 }
    )

  } catch (error) {
    console.error('❌ Revalidation error:', error)
    
    return NextResponse.json(
      { 
        success: false, 
        error: '❌ Internal server error',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}

/**
 * GET /api/revalidate
 * 
 * Информация о доступных параметрах ревалидации
 */
export async function GET() {
  return NextResponse.json({
    message: '🔄 On-Demand Revalidation API',
    usage: {
      method: 'POST',
      body: {
        secret: 'Required: Secret token from REVALIDATE_SECRET env',
        tag: 'Optional: Tag to revalidate (homepage, portfolio, lead)',
        path: 'Optional: Path to revalidate (/, /portfolio, etc.)'
      }
    },
    examples: [
      {
        description: 'Revalidate homepage settings',
        command: 'POST /api/revalidate with {"secret":"...", "tag":"homepage"}'
      },
      {
        description: 'Revalidate main page',
        command: 'POST /api/revalidate with {"secret":"...", "path":"/"}'
      },
      {
        description: 'Revalidate portfolio',
        command: 'POST /api/revalidate with {"secret":"...", "tag":"portfolio"}'
      }
    ]
  })
}

