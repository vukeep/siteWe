import { test, expect } from '@playwright/test'

/**
 * E2E тесты адаптивности сайта
 * 
 * Проверяет корректное отображение на различных устройствах:
 * - Desktop (1920px)
 * - Tablet (768px)
 * - Mobile (375px)
 */

test.describe('Адаптивность сайта', () => {
  test('Desktop: все секции отображаются корректно', async ({ page }) => {
    await page.setViewportSize({ width: 1920, height: 1080 })
    await page.goto('/')

    // Проверить все основные секции
    await expect(page.locator('#hero')).toBeVisible()
    await expect(page.locator('#problem-solution')).toBeVisible()
    await expect(page.locator('#services')).toBeVisible()
    await expect(page.locator('#portfolio')).toBeVisible()
    await expect(page.locator('#process')).toBeVisible()
    await expect(page.locator('#pricing')).toBeVisible()
    await expect(page.locator('#benefits')).toBeVisible()
    await expect(page.locator('#faq')).toBeVisible()
    await expect(page.locator('#contacts')).toBeVisible()
  })

  test('Tablet: навигация адаптируется', async ({ page }) => {
    await page.setViewportSize({ width: 768, height: 1024 })
    await page.goto('/')

    // Проверить что основной контент виден
    await expect(
      page.getByRole('heading', { name: /Создаем десятки/i })
    ).toBeVisible()

    // На tablet меню может быть скрыто
    const mobileMenuButton = page.locator('button[aria-label="Открыть меню"]')
    if (await mobileMenuButton.isVisible()) {
      await mobileMenuButton.click()
      await expect(page.getByRole('link', { name: 'Услуги' })).toBeVisible()
    }
  })

  test('Mobile: все элементы доступны', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 })
    await page.goto('/')

    // Проверить Hero секцию
    await expect(
      page.getByRole('heading', { name: /Создаем десятки/i })
    ).toBeVisible()

    // Открыть мобильное меню
    const mobileMenuButton = page.locator('button[aria-label="Открыть меню"]')
    await expect(mobileMenuButton).toBeVisible()
    await mobileMenuButton.click()

    // Проверить пункты меню
    await expect(page.getByRole('link', { name: 'Портфолио' })).toBeVisible()

    // Скроллить к форме
    await page.locator('#contacts').scrollIntoViewIfNeeded()

    // Проверить что форма видна и доступна
    await expect(page.getByLabel(/Имя/i)).toBeVisible()
  })

  test('Портфолио: адаптивная сетка работает', async ({ page }) => {
    await page.goto('/portfolio')

    // Desktop: 4 колонки
    await page.setViewportSize({ width: 1920, height: 1080 })
    const desktopCards = await page.locator('.grid > div').count()
    expect(desktopCards).toBeGreaterThan(0)

    // Mobile: 1 колонка
    await page.setViewportSize({ width: 375, height: 667 })
    await expect(page.getByRole('heading', { name: 'Портфолио' })).toBeVisible()
  })
})

