/**
 * Скрипт для заполнения начальных данных тарифов в Sanity
 * 
 * Создает:
 * - 3 тарифных плана (Start, Growth, Maximum)
 * - Настройки секции тарифов (заголовки, базовая стоимость)
 * 
 * Запуск: npx tsx scripts/seed-pricing.ts
 */

import { config } from 'dotenv'
import { resolve } from 'path'
import { createClient } from '@sanity/client'

// Загружаем .env.local явно
config({ path: resolve(process.cwd(), '.env.local') })

// Создаем клиента после загрузки переменных окружения
const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET!,
  apiVersion: '2021-03-25',
  useCdn: false,
  token: process.env.SANITY_API_TOKEN,
})

/**
 * Начальные тарифные планы
 */
const initialPricingPlans = [
  {
    _id: 'pricingPlan-start',
    _type: 'pricingPlan',
    name: 'Start',
    order: 1,
    videoCount: 'До 5 роликов',
    price: 100000,
    duration: '3 рабочих дня',
    features: [
      'Длительность до 30 секунд',
      'Единый стиль',
      'Один раунд правок',
      'Форматы для соцсетей',
      'Техническая поддержка',
    ],
    recommended: false,
    published: true,
  },
  {
    _id: 'pricingPlan-growth',
    _type: 'pricingPlan',
    name: 'Growth',
    order: 2,
    videoCount: 'До 20 роликов',
    price: 300000,
    duration: '7 рабочих дней',
    features: [
      'Длительность до 30 секунд',
      'Единый стиль и брендинг',
      'Два раунда правок',
      'Адаптация под платформы',
      'Приоритетная поддержка',
      'Отдаем по мере готовности',
    ],
    recommended: true,
    published: true,
  },
  {
    _id: 'pricingPlan-maximum',
    _type: 'pricingPlan',
    name: 'Maximum',
    order: 3,
    videoCount: 'До 50 роликов',
    price: 700000,
    duration: '10 рабочих дней',
    features: [
      'Длительность до 30 секунд',
      'Полный брендинг',
      'Три раунда правок',
      'Мультиформатная адаптация',
      'Выделенный менеджер',
      'Отдаем по мере готовности',
      'Контент-план в подарок',
    ],
    recommended: false,
    published: true,
  },
]

/**
 * Настройки секции тарифов
 */
const initialPricingSettings = {
  _id: 'pricingSettings',
  _type: 'pricingSettings',
  title: 'Стоимость',
  subtitle: 'Прозрачное ценообразование для любого объема видеопроизводства',
  basePricePerTenSeconds: 10000,
  basePriceDescription: '1 ролик: каждые 10 секунд =',
  customProjectTitle: 'Индивидуальные проекты',
  customProjectDescription:
    'Можем изготовить ролик со сложной концепцией любой длительности.\nСроки и стоимость рассчитываются индивидуально.',
  customProjectHighlight: '💰 Стоимость ниже классического продакшена в десятки раз!',
  customProjectButtonText: 'Получить точный расчёт',
  lastModified: new Date().toISOString(),
}

async function seedPricing() {
  console.log('🌱 Начинаем заполнение тарифов...\n')

  try {
    // Создаем настройки секции тарифов
    console.log('📋 Создаём настройки секции тарифов...')
    await client.createOrReplace(initialPricingSettings)
    console.log('✅ Настройки секции созданы\n')

    // Создаем тарифные планы
    console.log('💰 Создаём тарифные планы...')
    for (const plan of initialPricingPlans) {
      await client.createOrReplace(plan)
      console.log(`  ✅ ${plan.name} - ${(plan.price / 1000).toLocaleString('ru-RU')} тыс. ₽`)
    }

    console.log('\n🎉 Успешно! Все тарифы созданы!')
    console.log('\n📝 Теперь вы можете:')
    console.log('   1. Открыть /admin/structure/pricingPlan - управлять тарифными планами')
    console.log('   2. Открыть /admin/structure/pricingSettings - настроить заголовки и тексты')
    console.log('   3. Изменить цены, добавить новые пакеты, включить/выключить планы\n')
  } catch (error) {
    console.error('❌ Ошибка при создании тарифов:', error)
    process.exit(1)
  }
}

// Запускаем скрипт
seedPricing()

