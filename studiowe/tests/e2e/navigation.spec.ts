import { test, expect } from '@playwright/test'

/**
 * E2E тесты навигации по сайту
 * 
 * Проверяет:
 * - Загрузку главной страницы
 * - Работу навигации
 * - Smooth scroll к секциям
 * - Переходы между страницами
 */

test.describe('Навигация по сайту', () => {
  test('Главная страница загружается успешно', async ({ page }) => {
    await page.goto('/')

    // Проверить заголовок
    await expect(page).toHaveTitle(/StudioWe/)

    // Проверить наличие Hero секции
    await expect(
      page.getByRole('heading', { name: /Создаем десятки.*AI-роликов/i })
    ).toBeVisible()

    // Проверить наличие навигации
    await expect(page.getByRole('link', { name: 'Услуги' })).toBeVisible()
    await expect(page.getByRole('link', { name: 'Портфолио' })).toBeVisible()
    await expect(page.getByRole('link', { name: 'Стоимость' })).toBeVisible()
    await expect(page.getByRole('link', { name: 'Контакты' })).toBeVisible()
  })

  test('Навигация между секциями работает', async ({ page }) => {
    await page.goto('/')

    // Клик по "Портфолио" в навигации
    await page.getByRole('link', { name: 'Портфолио' }).click()

    // Проверить скролл к секции портфолио
    await expect(page.locator('#portfolio')).toBeInViewport()
  })

  test('Переход на страницу портфолио', async ({ page }) => {
    await page.goto('/')

    // Найти и кликнуть кнопку "Посмотреть все работы"
    await page.getByRole('link', { name: /Посмотреть все работы/i }).click()

    // Проверить URL
    await expect(page).toHaveURL('/portfolio')

    // Проверить заголовок страницы
    await expect(
      page.getByRole('heading', { name: 'Портфолио' })
    ).toBeVisible()
  })

  test('Footer содержит контакты и ссылки', async ({ page }) => {
    await page.goto('/')

    // Скроллить вниз
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight))

    // Проверить наличие контактов в footer
    await expect(page.getByRole('link', { name: /hello@studiowe/i })).toBeVisible()
    await expect(page.getByRole('link', { name: /\+7.*123/i })).toBeVisible()
  })
})

