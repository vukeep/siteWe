import { test, expect } from '@playwright/test'

/**
 * E2E тесты формы заявки
 * 
 * Проверяет:
 * - Валидацию полей
 * - Отображение ошибок
 * - Успешную отправку (с mock API)
 * - Различные состояния формы
 */

test.describe('Форма заявки', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/')
    
    // Скроллить к форме контактов
    await page.locator('#contacts').scrollIntoViewIfNeeded()
  })

  test('Форма отображается с всеми полями', async ({ page }) => {
    // Проверить наличие всех полей
    await expect(page.getByLabel(/Имя/i)).toBeVisible()
    await expect(page.getByLabel(/Компания/i)).toBeVisible()
    await expect(page.getByLabel(/Телефон/i)).toBeVisible()
    await expect(page.getByLabel(/Email/i)).toBeVisible()
    await expect(page.getByLabel(/Задача/i)).toBeVisible()

    // Проверить кнопку отправки
    await expect(
      page.getByRole('button', { name: /Получить консультацию/i })
    ).toBeVisible()
  })

  test('Валидация показывает ошибки для пустых полей', async ({ page }) => {
    // Кликнуть кнопку отправки без заполнения
    await page.getByRole('button', { name: /Получить консультацию/i }).click()

    // Проверить наличие ошибок валидации
    await expect(page.getByText(/Имя должно содержать минимум 2 символа/i)).toBeVisible()
  })

  test('Валидация email работает', async ({ page }) => {
    // Ввести невалидный email
    await page.getByLabel(/Email/i).fill('invalid-email')
    
    // Кликнуть в другое поле для триггера валидации
    await page.getByLabel(/Имя/i).click()
    
    // Кликнуть кнопку отправки
    await page.getByRole('button', { name: /Получить консультацию/i }).click()

    // Проверить ошибку
    await expect(page.getByText(/Некорректный email/i)).toBeVisible()
  })

  test('Успешное заполнение формы', async ({ page }) => {
    // Заполнить все поля корректными данными
    await page.getByLabel(/Имя/i).fill('Иван Иванов')
    await page.getByLabel(/Компания/i).fill('ООО "Тестовая компания"')
    await page.getByLabel(/Телефон/i).fill('+7 900 123 45 67')
    await page.getByLabel(/Email/i).fill('test@example.com')
    await page.getByLabel(/Задача/i).fill('Нужно создать 10 роликов для маркетинга')

    // Mock API ответ для успешной отправки
    await page.route('**/api/lead', async (route) => {
      await route.fulfill({
        status: 201,
        contentType: 'application/json',
        body: JSON.stringify({
          success: true,
          message: 'Спасибо! Ваша заявка принята.',
          leadId: 'LEAD-TEST-123',
        }),
      })
    })

    // Отправить форму
    await page.getByRole('button', { name: /Получить консультацию/i }).click()

    // Проверить сообщение об успехе
    await expect(
      page.getByText(/Спасибо! Ваша заявка принята/i)
    ).toBeVisible({ timeout: 10000 })
  })

  test('Honeypot защита работает', async ({ page }) => {
    // Заполнить honeypot поле (должно быть скрыто)
    await page.evaluate(() => {
      const honeypot = document.querySelector('input[name="_hp"]') as HTMLInputElement
      if (honeypot) {
        honeypot.value = 'bot-filled-this'
      }
    })

    // Заполнить остальные поля
    await page.getByLabel(/Имя/i).fill('Bot Name')
    await page.getByLabel(/Компания/i).fill('Bot Company')
    await page.getByLabel(/Телефон/i).fill('+7 900 000 00 00')
    await page.getByLabel(/Email/i).fill('bot@example.com')
    await page.getByLabel(/Задача/i).fill('Bot task description here')

    // Mock API ответ для блокировки бота
    await page.route('**/api/lead', async (route) => {
      const request = route.request()
      const postData = request.postDataJSON()

      if (postData._hp && postData._hp.length > 0) {
        await route.fulfill({
          status: 400,
          contentType: 'application/json',
          body: JSON.stringify({
            success: false,
            message: 'Invalid request',
          }),
        })
      }
    })

    // Попытка отправить форму
    await page.getByRole('button', { name: /Получить консультацию/i }).click()

    // Проверить что бот был заблокирован (форма не отправлена)
    await expect(
      page.getByText(/Спасибо! Ваша заявка принята/i)
    ).not.toBeVisible()
  })
})

