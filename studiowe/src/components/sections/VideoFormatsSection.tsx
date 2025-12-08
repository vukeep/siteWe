/**
 * Video Formats Section - Какие ролики мы создаем (Торговые ниши)
 * 
 * Современная реализация с scroll-driven анимациями:
 * - Sticky правая колонка с видео/изображением
 * - Intersection Observer для отслеживания активного тезиса
 * - Framer Motion для плавных переходов
 * - Адаптивный дизайн (desktop 2 колонки, mobile 1 колонка)
 * - Управление контентом через Sanity CMS
 * 
 * Архитектура:
 * - Левая колонка: тезисы с прокруткой
 * - Правая колонка: sticky медиа (видео или изображение), меняется по мере скролла
 * 
 * Производительность:
 * - IntersectionObserver вместо scroll events
 * - GPU-ускоренные анимации (transform, opacity)
 * - Lazy loading изображений/видео
 * - Данные из Sanity CMS с ISR кэшированием
 */

'use client'

import { useState, useRef, useEffect, useCallback } from 'react'
import { motion, useInView } from 'framer-motion'
import Image from 'next/image'
import { cn } from '@/lib/utils'
import type { TradingNiche } from '@/lib/sanity/queries'

// Для обратной совместимости с существующим кодом
interface VideoFormat {
  id: string
  title: string
  icon: string
  subcategories: string[]
  image: string // URL изображения/видео для sticky блока
  description: string // Краткое описание для подписи
  mediaType?: 'video' | 'image' // Тип медиа
  videoAutoplay?: boolean
  videoLoop?: boolean
  videoMuted?: boolean
  posterUrl?: string
}

// Данные форматов по умолчанию (fallback если нет данных из Sanity)
const defaultVideoFormats: VideoFormat[] = [
  {
    id: 'marketing',
    title: 'Маркетинг и продажи',
    icon: '📈',
    subcategories: [
      'Рекламные ролики для соцсетей',
      'Performance-креативы',
      'Промо и акции',
      'Объясняющие видео',
    ],
    image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&h=600&fit=crop',
    description: 'Видео, которые продают и привлекают клиентов'
  },
  {
    id: 'ecommerce',
    title: 'E-commerce',
    icon: '🛒',
    subcategories: [
      'Видео-карточки товаров',
      'Обзоры и демонстрации продуктов',
    ],
    image: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=800&h=600&fit=crop',
    description: 'Увеличьте конверсию в продажах'
  },
  {
    id: 'education',
    title: 'Обучение и HR',
    icon: '🎓',
    subcategories: [
      'Онбординг',
      'Инструкции и обучающие ролики',
      'Внутренние коммуникации',
    ],
    image: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800&h=600&fit=crop',
    description: 'Эффективное обучение сотрудников'
  },
  {
    id: 'brand',
    title: 'Бренд-контент',
    icon: '✨',
    subcategories: [
      'Имиджевые ролики',
      'Видео для событий и презентаций',
      'HR-бренд',
    ],
    image: 'https://images.unsplash.com/photo-1558655146-d09347e92766?w=800&h=600&fit=crop',
    description: 'Создайте узнаваемый образ бренда'
  },
  {
    id: 'ai-characters',
    title: 'AI-персонажи',
    icon: '🤖',
    subcategories: [
      'Ролики с цифровыми актерами',
      'Виртуальные ведущие и инфлюенсеры',
    ],
    image: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=800&h=600&fit=crop',
    description: 'Инновационный подход с AI-технологиями'
  },
  {
    id: 'series',
    title: 'Серии роликов',
    icon: '🎬',
    subcategories: [
      'Пакеты 10/30/50/100+ для кампаний',
      'Контент-сетки для соцсетей',
    ],
    image: 'https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?w=800&h=600&fit=crop',
    description: 'Масштабное производство контента'
  },
]

/**
 * Компонент отдельного тезиса (формата)
 * 
 * Использует IntersectionObserver для определения когда тезис в центре viewport
 * Обновляет активное состояние через callback
 */
function FormatItem({ 
  format, 
  index,
  totalCount,
  activeFormatIndex, 
  onActivate,
  priority = false
}: { 
  format: VideoFormat
  index: number
  totalCount: number
  activeFormatIndex: number
  onActivate: (index: number) => void
  priority?: boolean
}) {
  const ref = useRef(null)
  
  // IntersectionObserver с margin для активации в центре viewport
  const inView = useInView(ref, { 
    margin: "-50% 0px -50% 0px" // Строго по центру
  })

  // Вызываем callback когда элемент появляется в зоне видимости
  useEffect(() => {
    if (inView) {
      onActivate(index)
    }
  }, [inView, index, onActivate])

  // Логика прозрачности: чем дальше от активного, тем прозрачнее
  const distance = Math.abs(activeFormatIndex - index)
  // 0 -> 1, 1 -> 0.5, 2+ -> 0.2
  const opacity = distance === 0 ? 1 : Math.max(0.2, 0.5 - (distance - 1) * 0.1)

  return (
    <motion.div
      ref={ref}
      className={cn(
        "relative p-6 lg:p-8 transition-all duration-500 flex flex-col justify-center min-h-[300px]", // Фиксированная минимальная высота
        // Убрали рамки (border, shadow, bg) для чистого вида
      )}
      animate={{ opacity }} // Анимируем прозрачность через Framer Motion
      initial={{ opacity: 0, x: -30 }}
      whileInView={{ x: 0 }} 
      transition={{ duration: 0.5 }}
      viewport={{ once: true }}
    >
      {/* Маркер активного элемента (опционально, можно убрать для минимализма) */}
      <motion.div
        className="absolute left-0 top-6 bottom-6 w-1 bg-blue-600 rounded-full"
        initial={{ scaleY: 0 }}
        animate={{ scaleY: distance === 0 ? 1 : 0 }}
        transition={{ duration: 0.3, ease: "easeInOut" }}
      />

      {/* Верхняя часть: иконка + заголовок */}
      <div className="flex items-start gap-6 mb-6">
        {/* Иконка - делаем крупнее и без фона */}
        <div className="w-16 h-16 flex items-center justify-center">
          <span className="text-5xl">{format.icon}</span>
        </div>
        
        {/* Заголовок */}
        <div className="flex-1 pt-2">
          <h3 className={cn(
            "text-2xl lg:text-3xl font-bold mb-2 transition-colors duration-300",
            distance === 0 ? "text-neutral-900" : "text-neutral-500"
          )}>
            {format.title}
          </h3>
          {/* Номер (только на mobile для навигации) */}
          <span className="lg:hidden text-sm text-neutral-500">
            {String(index + 1).padStart(2, '0')} / {String(totalCount).padStart(2, '0')}
          </span>
        </div>
      </div>

      {/* Подкатегории */}
      <ul className="space-y-3 pl-[88px]">
        {format.subcategories.map((subcategory, idx) => (
          <motion.li
            key={idx}
            className="flex items-start gap-3"
          >
            <span className={cn(
              "mt-2 w-1.5 h-1.5 rounded-full flex-shrink-0 transition-colors duration-300",
              distance === 0 ? "bg-blue-600" : "bg-neutral-300"
            )} />
            <span className={cn(
              "text-base lg:text-lg transition-all duration-300",
              distance === 0 ? "text-neutral-800" : "text-neutral-400"
            )}>
              {subcategory}
            </span>
          </motion.li>
        ))}
      </ul>

      {/* Мобильное изображение (показывается только на mobile) */}
      <div className={cn(
        "lg:hidden mt-8 rounded-2xl overflow-hidden shadow-lg transition-opacity duration-500",
        distance === 0 ? "opacity-100" : "opacity-50"
      )}>
        <div className="relative aspect-video">
          {format.mediaType === 'video' && format.image ? (
            <video
              src={format.image}
              poster={format.posterUrl}
              muted
              playsInline
              loop
              autoPlay
              className="w-full h-full object-cover"
              aria-label={format.title}
            />
          ) : (
            <Image
              src={format.image}
              alt={format.title}
              fill
              className="object-cover"
              sizes="(max-width: 1024px) 100vw, 0vw"
              priority={priority}
            />
          )}
        </div>
      </div>
    </motion.div>
  )
}

/**
 * Sticky блок с изображением (только desktop)
 * 
 * Отображает изображение активного формата с плавными переходами
 */
function StickyImageDisplay({ 
  formats, 
  activeIndex 
}: { 
  formats: VideoFormat[]
  activeIndex: number
}) {
  const activeFormat = formats[activeIndex]

  // Защита от пустого массива или некорректного индекса
  if (!activeFormat || formats.length === 0) {
    return (
      <div className="relative rounded-3xl overflow-hidden shadow-2xl bg-gradient-to-br from-gray-100 to-gray-200 h-[85vh] flex items-center justify-center">
        <div className="text-center p-8">
          <p className="text-xl text-gray-500 mb-4">
            📝 Добавьте торговые ниши в админке
          </p>
          <a 
            href="/admin" 
            className="inline-block px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors"
          >
            Открыть админку
          </a>
        </div>
      </div>
    )
  }

  return (
    <div className="relative rounded-3xl overflow-hidden shadow-2xl bg-gradient-to-br from-gray-100 to-gray-200 h-[85vh] aspect-[9/16]">
      {/* Контейнер медиа на всю высоту */}
      <div className="relative h-full">
        {formats.map((format, index) => (
          <motion.div
            key={format.id}
            initial={{ opacity: 0 }}
            animate={{ 
              opacity: activeIndex === index ? 1 : 0,
              scale: activeIndex === index ? 1 : 0.98,
              zIndex: activeIndex === index ? 2 : 1
            }}
            transition={{ 
              duration: 0.6, 
              ease: [0.4, 0, 0.2, 1] // Custom easing для плавности
            }}
            className="absolute inset-0"
          >
            {/* Рендерим видео или изображение в зависимости от типа */}
            {format.mediaType === 'video' && format.image ? (
              <video
                src={format.image}
                poster={format.posterUrl}
                autoPlay={format.videoAutoplay ?? true}
                loop={format.videoLoop ?? true}
                muted={format.videoMuted ?? true}
                playsInline
                className="w-full h-full object-contain"
                aria-label={format.title}
              />
            ) : (
              <Image
                src={format.image}
                alt={format.title}
                fill
                className="object-cover"
                sizes="(min-width: 1024px) 50vw, 0vw"
                priority={index === 0} // Первое изображение загружаем с приоритетом
              />
            )}
          </motion.div>
        ))}

        {/* Градиент оверлей для лучшей читаемости текста */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent z-10" />
      </div>

      {/* Информационная панель снизу */}
      <motion.div 
        className="absolute bottom-0 left-0 right-0 z-20 p-6 bg-white/95 backdrop-blur-md"
        initial={{ y: 100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <motion.div
          key={activeIndex}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.4 }}
        >
          {/* Иконка + заголовок */}
          <div className="flex items-center gap-4 mb-3">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center shadow-lg">
              <span className="text-2xl">{activeFormat.icon}</span>
            </div>
            <div className="flex-1">
              <h3 className="text-xl font-bold text-neutral-900">
                {activeFormat.title}
              </h3>
              <span className="text-sm text-neutral-500">
                {String(activeIndex + 1).padStart(2, '0')} / {String(formats.length).padStart(2, '0')}
              </span>
            </div>
          </div>

          {/* Описание */}
          <p className="text-sm text-neutral-700 leading-relaxed">
            {activeFormat.description}
          </p>
        </motion.div>
      </motion.div>

      {/* Индикаторы прогресса */}
      <div className="absolute top-6 right-6 z-20 flex gap-2">
        {formats.map((_, index) => (
          <motion.div
            key={index}
            className={cn(
              "h-1 rounded-full transition-all duration-300",
              activeIndex === index 
                ? "w-8 bg-white shadow-lg" 
                : "w-4 bg-white/50"
            )}
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: index * 0.1 }}
          />
        ))}
      </div>
    </div>
  )
}

/**
 * Основной компонент секции
 * 
 * Layout:
 * - Desktop: 2 колонки (тезисы слева, sticky изображение справа)
 * - Mobile: 1 колонка (последовательная прокрутка)
 * 
 * @param niches - Данные торговых ниш из Sanity CMS (опционально)
 */
export function VideoFormatsSection({ niches }: { niches?: TradingNiche[] }) {
  // Преобразуем данные из Sanity в формат VideoFormat
  const videoFormats: VideoFormat[] = niches && niches.length > 0 
    ? niches.map(niche => ({
        id: niche.id,
        title: niche.title,
        icon: niche.icon,
        subcategories: niche.subcategories,
        image: niche.optimizedMediaUrl,
        description: niche.description,
        mediaType: niche.mediaType,
        videoAutoplay: niche.videoAutoplay,
        videoLoop: niche.videoLoop,
        videoMuted: niche.videoMuted,
        posterUrl: niche.posterUrl
      }))
    : defaultVideoFormats // Fallback на статичные данные

  // Состояние активного формата (индекс)
  const [activeFormat, setActiveFormat] = useState(0)

  // Мемоизированный callback для активации формата
  // Предотвращает бесконечный цикл в useEffect
  const handleActivate = useCallback((index: number) => {
    setActiveFormat(index)
  }, [])

  // Защита от пустого массива
  if (videoFormats.length === 0) {
    return (
      <section id="services" className="snap-section py-8 lg:py-12 bg-gradient-to-br from-gray-50 via-white to-gray-50">
        <div className="container-custom">
          <div className="max-w-2xl mx-auto text-center py-20">
            <h2 className="text-3xl font-bold text-neutral-900 mb-4">
              📝 Настройка торговых ниш
            </h2>
            <p className="text-lg text-neutral-600 mb-8">
              Добавьте форматы роликов через админку Sanity
            </p>
            <a 
              href="/admin" 
              className="inline-block px-8 py-4 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors shadow-lg"
            >
              Открыть админку
            </a>
          </div>
        </div>
      </section>
    )
  }

  return (
    <section id="services" className="snap-section py-8 lg:py-12 bg-gradient-to-br from-gray-50 via-white to-gray-50">
      <div className="container-custom">
        {/* Основная layout: 2 колонки */}
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-16 items-start max-w-7xl mx-auto">
          
          {/* Левая колонка: Тезисы с прокруткой */}
          <div className="space-y-8 lg:space-y-24 lg:pt-[40vh] lg:pb-[60vh]">
            {videoFormats.map((format, index) => (
              <FormatItem
                key={format.id}
                format={format}
                index={index}
                totalCount={videoFormats.length}
                activeFormatIndex={activeFormat}
                onActivate={handleActivate}
                priority={index === 0}
              />
            ))}
          </div>

          {/* Правая колонка: Sticky изображение (только на desktop) */}
          <div className="hidden lg:flex lg:justify-center lg:sticky lg:top-24 h-fit">
            <StickyImageDisplay 
              formats={videoFormats}
              activeIndex={activeFormat}
            />
          </div>
        </div>

        {/* CTA */}
        <motion.div 
          className="text-center mt-12 lg:mt-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <p className="text-neutral-600 mb-6 text-lg">
            Не нашли нужный формат? Напишите нам, и мы подберем решение под вашу задачу
          </p>
          <a
            href="#contacts"
            className="inline-block px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-semibold text-lg transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105"
          >
            Обсудить проект
          </a>
        </motion.div>
      </div>
    </section>
  )
}

