import { defineConfig, devices } from '@playwright/test'

/**
 * Конфигурация Playwright для E2E тестирования
 * 
 * Тестирует критичные сценарии:
 * - Навигацию по сайту
 * - Отправку формы заявки
 * - Фильтрацию портфолио
 * - Адаптивность на разных устройствах
 */

export default defineConfig({
  // Папка с тестами
  testDir: './tests/e2e',

  // Таймауты
  timeout: 30 * 1000,
  expect: {
    timeout: 5000,
  },

  // Запуск тестов
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,

  // Репортеры
  reporter: 'html',

  // Общие настройки для всех проектов
  use: {
    baseURL: 'http://localhost:3000',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
  },

  // Проекты (браузеры и устройства для тестирования)
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'firefox',
      use: { ...devices['Desktop Firefox'] },
    },
    {
      name: 'webkit',
      use: { ...devices['Desktop Safari'] },
    },
    {
      name: 'mobile-chrome',
      use: { ...devices['Pixel 5'] },
    },
    {
      name: 'mobile-safari',
      use: { ...devices['iPhone 12'] },
    },
  ],

  // Web Server (запускается автоматически)
  webServer: {
    command: 'npm run dev',
    url: 'http://localhost:3000',
    reuseExistingServer: !process.env.CI,
  },
})

