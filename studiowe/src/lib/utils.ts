import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

/**
 * Утилита для объединения Tailwind классов
 * Использует clsx и tailwind-merge для правильного разрешения конфликтов
 * 
 * @param inputs - Массив классов или условных выражений
 * @returns Объединенная строка классов
 * 
 * @example
 * ```tsx
 * <div className={cn('p-4', isActive && 'bg-blue-500', className)} />
 * ```
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Форматирование цены в рубли
 * 
 * @param price - Цена в рублях
 * @returns Отформатированная строка с пробелами
 * 
 * @example
 * formatPrice(100000) // "100 000 ₽"
 */
export function formatPrice(price: number): string {
  return new Intl.NumberFormat('ru-RU', {
    style: 'currency',
    currency: 'RUB',
    minimumFractionDigits: 0,
  }).format(price)
}

/**
 * Форматирование даты на русском языке
 * 
 * @param date - Дата для форматирования
 * @returns Отформатированная строка даты
 * 
 * @example
 * formatDate(new Date()) // "1 января 2024"
 */
export function formatDate(date: Date | string): string {
  const d = typeof date === 'string' ? new Date(date) : date
  return new Intl.DateTimeFormat('ru-RU', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(d)
}

/**
 * Генерация slug из строки
 * Транслитерация кириллицы в латиницу
 * 
 * @param text - Текст для преобразования
 * @returns URL-безопасный slug
 * 
 * @example
 * generateSlug("Маркетинговые ролики") // "marketingovye-roliki"
 */
export function generateSlug(text: string): string {
  const translitMap: Record<string, string> = {
    'а': 'a', 'б': 'b', 'в': 'v', 'г': 'g', 'д': 'd', 'е': 'e', 'ё': 'yo',
    'ж': 'zh', 'з': 'z', 'и': 'i', 'й': 'y', 'к': 'k', 'л': 'l', 'м': 'm',
    'н': 'n', 'о': 'o', 'п': 'p', 'р': 'r', 'с': 's', 'т': 't', 'у': 'u',
    'ф': 'f', 'х': 'h', 'ц': 'ts', 'ч': 'ch', 'ш': 'sh', 'щ': 'sch',
    'ъ': '', 'ы': 'y', 'ь': '', 'э': 'e', 'ю': 'yu', 'я': 'ya',
  }

  return text
    .toLowerCase()
    .split('')
    .map(char => translitMap[char] || char)
    .join('')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

/**
 * Debounce функция для оптимизации производительности
 * 
 * @param func - Функция для debounce
 * @param wait - Задержка в миллисекундах
 * @returns Debounced функция
 */
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout | null = null

  return function executedFunction(...args: Parameters<T>) {
    const later = () => {
      timeout = null
      func(...args)
    }

    if (timeout) {
      clearTimeout(timeout)
    }
    timeout = setTimeout(later, wait)
  }
}

/**
 * Throttle функция для ограничения частоты вызовов
 * 
 * @param func - Функция для throttle
 * @param limit - Минимальный интервал между вызовами в мс
 * @returns Throttled функция
 */
export function throttle<T extends (...args: any[]) => any>(
  func: T,
  limit: number
): (...args: Parameters<T>) => void {
  let inThrottle: boolean = false

  return function executedFunction(...args: Parameters<T>) {
    if (!inThrottle) {
      func(...args)
      inThrottle = true
      setTimeout(() => {
        inThrottle = false
      }, limit)
    }
  }
}

/**
 * Проверка валидности email
 * 
 * @param email - Email для проверки
 * @returns true если email валидный
 */
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

/**
 * Truncate текста с многоточием
 * 
 * @param text - Текст для обрезки
 * @param maxLength - Максимальная длина
 * @returns Обрезанный текст
 */
export function truncate(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text
  return text.slice(0, maxLength).trim() + '...'
}

