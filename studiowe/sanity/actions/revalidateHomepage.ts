/**
 * Sanity Document Action: Revalidate Homepage
 * 
 * Кастомное действие для принудительной ревалидации главной страницы.
 * Появляется в меню документа homepage в Sanity Studio.
 * 
 * Производительность: Отправляет запрос на /api/revalidate для немедленного обновления
 */

import { DocumentActionComponent } from 'sanity'

/**
 * Действие "Обновить Главную" для homepage документа
 * 
 * Использование:
 * 1. Открываем homepage в Sanity Studio
 * 2. Нажимаем кнопку "🔄 Обновить Главную" в правом верхнем углу
 * 3. Главная страница сайта обновляется немедленно
 */
export const revalidateHomepageAction: DocumentActionComponent = (props) => {
  const { type, published } = props

  // Показываем действие только для homepage документов
  if (type !== 'homepage') {
    return null
  }

  return {
    label: '🔄 Обновить Главную',
    tone: 'primary',
    onHandle: async () => {
      try {
        // Определяем URL для ревалидации
        const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'
        const revalidateUrl = `${baseUrl}/api/revalidate`
        const secret = process.env.NEXT_PUBLIC_REVALIDATE_SECRET || 'dev-secret'

        // Отправляем запрос на ревалидацию
        const response = await fetch(revalidateUrl, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            secret,
            tag: 'homepage',
          }),
        })

        const data = await response.json()

        if (response.ok && data.success) {
          // Успешная ревалидация
          props.onComplete()
          
          // Показываем уведомление об успехе (toast)
          alert('✅ Главная страница успешно обновлена!')
        } else {
          // Ошибка ревалидации
          console.error('Revalidation failed:', data)
          alert(`❌ Ошибка обновления: ${data.error || 'Unknown error'}`)
        }
      } catch (error) {
        console.error('Revalidation error:', error)
        alert(`❌ Не удалось обновить страницу: ${error instanceof Error ? error.message : 'Unknown error'}`)
      }
    },
  }
}

