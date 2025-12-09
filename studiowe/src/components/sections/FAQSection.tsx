/**
 * FAQ Section - Часто задаваемые вопросы
 * 
 * Server Component, получающий данные из Sanity CMS.
 * Все вопросы и ответы управляются через админку:
 * - /admin/structure/faqItem - управление вопросами
 * - /admin/structure/faqSettings - настройки секции (заголовки, CTA)
 * 
 * Features:
 * - SSR с ISR (revalidate: 3600)
 * - Динамическое обновление вопросов
 * - Кастомизация всех текстов через админку
 * - Аккордеон с анимацией (клиентская часть)
 */

import { getFAQItems, getFAQSettings } from '@/lib/sanity/queries'
import { FAQClient } from './FAQClient'

export async function FAQSection() {
  // Получаем данные из Sanity
  const items = await getFAQItems()
  const settings = await getFAQSettings()

  // Fallback значения если настройки не загружены
  const title = settings?.title || 'Частые вопросы'
  const subtitle = settings?.subtitle || 'Ответы на популярные вопросы о работе с AI-видеопродакшном'
  const ctaText = settings?.ctaText || 'Не нашли ответ на свой вопрос?'
  const ctaButtonText = settings?.ctaButtonText || 'Задать вопрос'

  return (
    <FAQClient 
      items={items}
      title={title}
      subtitle={subtitle}
      ctaText={ctaText}
      ctaButtonText={ctaButtonText}
    />
  )
}

