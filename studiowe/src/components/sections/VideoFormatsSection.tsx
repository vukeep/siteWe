/**
 * Video Formats Section - Какие ролики мы создаем
 * 
 * Современная реализация с scroll-driven анимациями:
 * - Sticky правая колонка с изображением
 * - Intersection Observer для отслеживания активного тезиса
 * - Framer Motion для плавных переходов
 * - Адаптивный дизайн (desktop 2 колонки, mobile 1 колонка)
 * 
 * Архитектура:
 * - Левая колонка: тезисы с прокруткой
 * - Правая колонка: sticky изображение, меняется по мере скролла
 * 
 * Производительность:
 * - IntersectionObserver вместо scroll events
 * - GPU-ускоренные анимации (transform, opacity)
 * - Lazy loading изображений
 */

'use client'

import { useState, useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import Image from 'next/image'
import { cn } from '@/lib/utils'

interface VideoFormat {
  id: string
  title: string
  icon: string
  subcategories: string[]
  image: string // URL изображения для sticky блока
  description: string // Краткое описание для подписи
}

// Данные форматов с изображениями для демонстрации
const videoFormats: VideoFormat[] = [
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
 * Вызывает callback onInView для обновления активного состояния
 */
function FormatItem({ 
  format, 
  index, 
  isActive, 
  onInView 
}: { 
  format: VideoFormat
  index: number
  isActive: boolean
  onInView: () => void
}) {
  const ref = useRef(null)
  
  // IntersectionObserver с margin для активации в центре viewport
  const inView = useInView(ref, { 
    margin: "-40% 0px -40% 0px" // Активируется когда элемент в центральной зоне
  })

  // Вызываем callback когда элемент появляется в зоне видимости
  if (inView && !isActive) {
    onInView()
  }

  return (
    <motion.div
      ref={ref}
      className={cn(
        "relative p-6 lg:p-8 rounded-2xl transition-all duration-500",
        "border-2",
        isActive 
          ? "bg-blue-50 border-blue-500 shadow-xl" 
          : "bg-white border-gray-200 hover:border-blue-300 shadow-md"
      )}
      initial={{ opacity: 0, x: -30 }}
      whileInView={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      viewport={{ once: true }}
    >
      {/* Вертикальная линия-индикатор активности */}
      <motion.div
        className="absolute left-0 top-6 bottom-6 w-1 bg-blue-600 rounded-full"
        initial={{ scaleY: 0 }}
        animate={{ scaleY: isActive ? 1 : 0 }}
        transition={{ duration: 0.3, ease: "easeInOut" }}
      />

      {/* Верхняя часть: иконка + заголовок */}
      <div className="flex items-start gap-4 mb-4">
        {/* Иконка */}
        <motion.div 
          className={cn(
            "w-14 h-14 rounded-2xl flex items-center justify-center transition-all duration-300",
            isActive 
              ? "bg-blue-600 shadow-lg scale-110" 
              : "bg-gradient-to-br from-blue-50 to-purple-50"
          )}
          animate={{ 
            scale: isActive ? 1.1 : 1,
            rotate: isActive ? [0, -5, 5, 0] : 0
          }}
          transition={{ duration: 0.3 }}
        >
          <span className="text-3xl">{format.icon}</span>
        </motion.div>
        
        {/* Заголовок */}
        <div className="flex-1">
          <h3 className={cn(
            "text-xl lg:text-2xl font-bold mb-1 transition-colors duration-300",
            isActive ? "text-blue-900" : "text-neutral-900"
          )}>
            {format.title}
          </h3>
          {/* Номер (только на mobile для навигации) */}
          <span className="lg:hidden text-sm text-neutral-500">
            {String(index + 1).padStart(2, '0')} / {String(videoFormats.length).padStart(2, '0')}
          </span>
        </div>
      </div>

      {/* Подкатегории */}
      <ul className="space-y-2.5 pl-[72px]">
        {format.subcategories.map((subcategory, idx) => (
          <motion.li
            key={idx}
            className="flex items-start gap-3"
            initial={{ opacity: 0, x: -10 }}
            animate={{ 
              opacity: isActive ? 1 : 0.7,
              x: 0 
            }}
            transition={{ delay: idx * 0.05, duration: 0.3 }}
          >
            <span className={cn(
              "mt-1.5 flex-shrink-0 transition-colors duration-300",
              isActive ? "text-blue-600" : "text-gray-400"
            )}>
              •
            </span>
            <span className={cn(
              "text-sm lg:text-base transition-all duration-300",
              isActive ? "text-blue-900 font-medium" : "text-neutral-700"
            )}>
              {subcategory}
            </span>
          </motion.li>
        ))}
      </ul>

      {/* Мобильное изображение (показывается только на mobile) */}
      <div className="lg:hidden mt-6 rounded-xl overflow-hidden shadow-lg">
        <div className="relative aspect-video">
          <Image
            src={format.image}
            alt={format.title}
            fill
            className="object-cover"
            sizes="(max-width: 1024px) 100vw, 0vw"
          />
        </div>
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-4 text-white">
          <p className="text-sm font-medium">{format.description}</p>
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

  return (
    <div className="relative rounded-3xl overflow-hidden shadow-2xl bg-gradient-to-br from-gray-100 to-gray-200 h-[85vh]">
      {/* Контейнер изображений на всю высоту */}
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
            <Image
              src={format.image}
              alt={format.title}
              fill
              className="object-cover"
              sizes="(min-width: 1024px) 50vw, 0vw"
              priority={index === 0} // Первое изображение загружаем с приоритетом
            />
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
 */
export function VideoFormatsSection() {
  // Состояние активного формата (индекс)
  const [activeFormat, setActiveFormat] = useState(0)

  return (
    <section id="services" className="snap-section py-8 lg:py-12 bg-gradient-to-br from-gray-50 via-white to-gray-50">
      <div className="container-custom">
        {/* Основная layout: 2 колонки */}
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-16 items-start max-w-7xl mx-auto">
          
          {/* Левая колонка: Тезисы с прокруткой */}
          <div className="space-y-4 lg:space-y-8 lg:pt-[40vh] lg:pb-[40vh]">
            {videoFormats.map((format, index) => (
              <FormatItem
                key={format.id}
                format={format}
                index={index}
                isActive={activeFormat === index}
                onInView={() => setActiveFormat(index)}
              />
            ))}
          </div>

          {/* Правая колонка: Sticky изображение (только на desktop) */}
          <div className="hidden lg:block lg:sticky lg:top-8 h-fit">
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

