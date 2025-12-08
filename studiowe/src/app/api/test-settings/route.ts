/**
 * API Route: Test Settings
 * 
 * Тестовый роут для проверки получения настроек из Sanity
 */

import { NextResponse } from 'next/server'
import { getSiteSettings } from '@/lib/sanity/queries'

export async function GET() {
  try {
    const settings = await getSiteSettings()
    
    return NextResponse.json({
      success: true,
      settings: {
        backgroundColor: settings?.backgroundColor?.hex || 'not set',
        headingColor: settings?.headingColor?.hex || 'not set',
        buttonColor: settings?.buttonColor?.hex || 'not set',
        buttonHoverColor: settings?.buttonHoverColor?.hex || 'not set',
      },
      raw: settings
    })
  } catch (error) {
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}

