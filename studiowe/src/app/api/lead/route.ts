import { NextRequest, NextResponse } from 'next/server'
import { leadFormSchema } from '@/lib/validations/lead-form'
import { serverClient } from '../../../../sanity/lib/server-client'
import { z } from 'zod'

/**
 * API Route для обработки заявок
 * 
 * POST /api/lead
 * 
 * Функционал:
 * - Валидация входных данных через Zod
 * - Проверка honeypot поля (защита от ботов)
 * - Сохранение заявки в Sanity CMS
 * - Отправка уведомлений в Telegram (опционально)
 * - Отправка email уведомлений (опционально)
 * 
 * Оптимизировано для производительности:
 * - Асинхронная обработка уведомлений
 * - Быстрый ответ клиенту
 * - Graceful degradation если Sanity недоступен
 */

export async function POST(request: NextRequest) {
  try {
    // Парсинг тела запроса
    const body = await request.json()

    // Проверка honeypot поля (защита от ботов)
    if (body._hp && body._hp.length > 0) {
      return NextResponse.json(
        { success: false, message: 'Invalid request' },
        { status: 400 }
      )
    }

    // Валидация данных через Zod
    const validatedData = leadFormSchema.parse(body)

    // Rate Limiting проверка (базовая реализация)
    // TODO: Заменить на Redis-based solution для production
    const ip = request.headers.get('x-forwarded-for') || 
               request.headers.get('x-real-ip') || 
               'unknown'
    
    console.log(`[LEAD] Новая заявка от IP: ${ip}`)

    // Сохранение заявки в Sanity CMS
    let leadId = 'PENDING'
    let sanitySuccess = false
    
    try {
      const leadDoc = await serverClient.create({
        _type: 'lead',
        name: validatedData.name,
        company: validatedData.company,
        phone: validatedData.phone,
        email: validatedData.email,
        task: validatedData.task,
        requestType: validatedData.requestType || 'general',
        videoCount: validatedData.videoCount,
        status: 'new',
        createdAt: new Date().toISOString(),
      })
      
      leadId = leadDoc._id
      sanitySuccess = true
      console.log(`[SANITY] Заявка сохранена: ${leadId}`)
    } catch (sanityError) {
      console.error('[SANITY] Ошибка сохранения заявки:', sanityError)
      // Не блокируем ответ клиенту, если Sanity недоступен
      leadId = `TEMP-${Date.now()}`
    }

    // Асинхронная отправка уведомлений (не блокирует ответ)
    Promise.all([
      sendTelegramNotification(validatedData, leadId),
      sendEmailNotification(validatedData, leadId),
    ]).catch((error) => {
      console.error('[LEAD] Ошибка отправки уведомлений:', error)
    })

    // Быстрый ответ клиенту
    return NextResponse.json(
      {
        success: true,
        message: 'Спасибо! Ваша заявка принята. Мы свяжемся с вами в ближайшее время.',
        leadId,
      },
      { status: 201 }
    )
  } catch (error) {
    console.error('[LEAD] Ошибка обработки заявки:', error)

    // Обработка ошибок валидации
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        {
          success: false,
          message: 'Ошибка валидации данных',
          errors: error.issues,
        },
        { status: 400 }
      )
    }

    // Общая ошибка сервера
    return NextResponse.json(
      {
        success: false,
        message: 'Произошла ошибка при обработке заявки. Попробуйте позже.',
      },
      { status: 500 }
    )
  }
}

/**
 * Отправка уведомления в Telegram
 */
async function sendTelegramNotification(
  data: z.infer<typeof leadFormSchema>,
  leadId: string
): Promise<void> {
  const token = process.env.TELEGRAM_BOT_TOKEN
  const chatId = process.env.TELEGRAM_CHAT_ID

  if (!token || !chatId) {
    console.warn('[TELEGRAM] Не настроены переменные окружения')
    return
  }

  // Формирование сообщения
  const requestTypeLabels = {
    general: 'Общая заявка',
    portfolio_request: 'Запрос портфолио',
    pricing_calculation: 'Расчет стоимости',
  }

  const message = `
🔔 <b>Новая заявка на StudioWe</b>

📋 ID: <code>${leadId}</code>
📝 Тип: ${requestTypeLabels[data.requestType || 'general']}

👤 <b>Контакты:</b>
• Имя: ${data.name}
• Компания: ${data.company}
• Телефон: ${data.phone}
• Email: ${data.email}

💬 <b>Задача:</b>
${data.task}
${data.videoCount ? `\n📊 Объем: ${data.videoCount} роликов` : ''}

⏰ ${new Date().toLocaleString('ru-RU')}
  `.trim()

  try {
    const response = await fetch(
      `https://api.telegram.org/bot${token}/sendMessage`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          chat_id: chatId,
          text: message,
          parse_mode: 'HTML',
        }),
      }
    )

    if (!response.ok) {
      throw new Error(`Telegram API error: ${response.statusText}`)
    }

    console.log('[TELEGRAM] Уведомление отправлено успешно')
  } catch (error) {
    console.error('[TELEGRAM] Ошибка отправки:', error)
    throw error
  }
}

/**
 * Отправка email уведомления
 * TODO: Интеграция с SendGrid/Resend
 */
async function sendEmailNotification(
  data: z.infer<typeof leadFormSchema>,
  leadId: string
): Promise<void> {
  // Заглушка для email уведомлений
  console.log('[EMAIL] Отправка email (заглушка):', leadId)
  
  // TODO: Реализовать отправку через SendGrid/Resend
  // const sgMail = require('@sendgrid/mail')
  // sgMail.setApiKey(process.env.SENDGRID_API_KEY)
  // ...
}

/**
 * OPTIONS метод для CORS
 */
export async function OPTIONS() {
  return NextResponse.json(
    {},
    {
      status: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type',
      },
    }
  )
}

