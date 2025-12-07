/**
 * Sanity Studio Page
 * 
 * Встроенный Sanity Studio на маршруте /admin.
 * Используется для управления контентом сайта.
 */

'use client'

import { NextStudio } from 'next-sanity/studio'
import config from '../../../../sanity/sanity.config'

export default function AdminPage() {
  return <NextStudio config={config} />
}


