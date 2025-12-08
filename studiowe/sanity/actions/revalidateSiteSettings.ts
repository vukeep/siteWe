/**
 * Sanity Document Action: Revalidate Site Settings
 * 
 * Кастомное действие для принудительной ревалидации настроек сайта.
 */

import { DocumentActionComponent } from 'sanity'

export const revalidateSiteSettingsAction: DocumentActionComponent = (props) => {
  const { type } = props

  if (type !== 'siteSettings') {
    return null
  }

  return {
    label: '🔄 Обновить настройки',
    tone: 'primary',
    onHandle: async () => {
      try {
        const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'
        const revalidateUrl = `${baseUrl}/api/revalidate`
        const secret = process.env.NEXT_REVALIDATE_SECRET || process.env.NEXT_PUBLIC_REVALIDATE_SECRET || 'dev-secret'

        const response = await fetch(revalidateUrl, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            secret,
            tag: 'site-settings', // Tag to revalidate
          }),
        })

        const data = await response.json()

        if (response.ok && data.success) {
          props.onComplete()
          alert('✅ Настройки сайта обновлены!')
        } else {
          console.error('Revalidation failed:', data)
          alert(`❌ Ошибка обновления: ${data.error || 'Unknown error'}`)
        }
      } catch (error) {
        console.error('Revalidation error:', error)
        alert(`❌ Не удалось обновить настройки: ${error instanceof Error ? error.message : 'Unknown error'}`)
      }
    },
  }
}

