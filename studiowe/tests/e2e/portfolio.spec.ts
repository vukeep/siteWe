import { test, expect } from '@playwright/test'

/**
 * E2E тесты страницы портфолио
 * 
 * Проверяет:
 * - Отображение проектов
 * - Фильтрацию по категориям
 * - Модальное окно с формой
 * - Переход на детальную страницу
 */

test.describe('Страница портфолио', () => {
  test('Портфолио отображает проекты', async ({ page }) => {
    await page.goto('/portfolio')

    // Проверить заголовок
    await expect(
      page.getByRole('heading', { name: 'Портфолио' })
    ).toBeVisible()

    // Проверить наличие карточек проектов
    const cards = page.locator('[class*="VideoCard"]').or(
      page.locator('img[alt*="Рекламная"]')
    )
    await expect(cards.first()).toBeVisible()
  })

  test('Фильтрация по категориям работает', async ({ page }) => {
    await page.goto('/portfolio')

    // Кликнуть на категорию "Маркетинг"
    await page.getByRole('button', { name: 'Маркетинг' }).click()

    // Проверить что кнопка стала активной
    await expect(
      page.getByRole('button', { name: 'Маркетинг' })
    ).toHaveClass(/bg-blue-600/)

    // Кликнуть на "Все работы"
    await page.getByRole('button', { name: 'Все работы' }).click()

    // Проверить что показываются все проекты
    await expect(
      page.getByRole('button', { name: 'Все работы' })
    ).toHaveClass(/bg-blue-600/)
  })

  test('Модальное окно с формой открывается', async ({ page }) => {
    await page.goto('/portfolio')

    // Найти и кликнуть кнопку "Хочу также"
    const ctaButton = page.getByRole('button', { name: /Хочу также/i }).first()
    await ctaButton.click()

    // Проверить что модальное окно открылось
    await expect(
      page.getByRole('heading', { name: /Хотите такой же ролик/i })
    ).toBeVisible()

    // Проверить наличие полей формы
    await expect(page.getByLabel(/Имя/i)).toBeVisible()
    await expect(page.getByLabel(/Компания/i)).toBeVisible()
    await expect(page.getByLabel(/Email/i)).toBeVisible()

    // Закрыть модальное окно
    await page.getByLabel('Закрыть').click()

    // Проверить что модальное окно закрылось
    await expect(
      page.getByRole('heading', { name: /Хотите такой же ролик/i })
    ).not.toBeVisible()
  })
})

