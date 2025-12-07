/**
 * Sanity Studio Page
 * 
 * Встроенный Sanity Studio на маршруте /admin.
 * Используется для управления контентом сайта.
 * 
 * Примечание: Предупреждение "disableTransition prop" в консоли - 
 * известная проблема совместимости Next.js 16 и Sanity Studio 3.
 * Не влияет на функциональность и будет исправлено в будущих версиях.
 * 
 * @see https://github.com/sanity-io/next-sanity/issues
 */

'use client'

import { useEffect } from 'react'
import { NextStudio } from 'next-sanity/studio'
import config from '../../../../sanity/sanity.config'

export default function AdminPage() {
  // Фильтруем известное предупреждение о disableTransition
  useEffect(() => {
    const originalError = console.error
    console.error = (...args: any[]) => {
      const message = args[0]
      // Игнорируем только конкретное предупреждение о disableTransition
      if (
        typeof message === 'string' && 
        message.includes('disableTransition') && 
        message.includes('React does not recognize')
      ) {
        return
      }
      originalError.apply(console, args)
    }

    return () => {
      console.error = originalError
    }
  }, [])

  return (
    <div style={{ height: '100vh' }}>
      <NextStudio config={config} />
    </div>
  )
}


