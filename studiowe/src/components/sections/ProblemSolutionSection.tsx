'use client'

import { useState, useEffect, useMemo } from 'react'
import { motion, AnimatePresence, type Variants } from 'framer-motion'
import Image from 'next/image'
import { cn } from '@/lib/utils'

interface ProblemSolutionSlide {
  title: string
  images: string[]
}

interface ProblemSolutionSectionProps {
  slides?: ProblemSolutionSlide[]
  sectionTitle?: string
}

/**
 * ProblemSolutionSection - Секция "Проблема/Решение" (Pinterest Style)
 * 
 * Реализует динамическую карусель преимуществ с анимацией в стиле Pinterest.
 * Центральный заголовок статичен, под ним меняются смысловые блоки.
 * Анимация карточек происходит каскадом (stagger) слева направо по столбцам.
 */

// Статичные данные для карусели (резервный вариант)
const DEFAULT_PLACEHOLDER = "https://res.cloudinary.com/avitophoto/video/upload/so_0,f_webp,q_auto/v1765111731/studiowe/video/cake_tj6fpi.webp"

const DEFAULT_ITEMS = [
  { id: 1, title: "Видео за 72 часа" },
  { id: 2, title: "Один стиль. Всегда." },
  { id: 3, title: "10. 20. 50. роликов" },
  { id: 4, title: "Юридическая безопасность" },
  { id: 5, title: "Видеопродакшн без боли" },
]

// Шаблоны высот и цветов для masonry сетки (повторяются)
const GRID_TEMPLATES = [
  ['h-48', 'h-64'],
  ['h-64', 'h-56'],
  ['h-52', 'h-72'],
  ['h-72', 'h-48'],
  ['h-48', 'h-64'],
  ['h-60', 'h-52'],
  ['h-56', 'h-48'],
]

const BG_COLORS = ['bg-blue-50', 'bg-purple-50', 'bg-green-50', 'bg-orange-50', 'bg-rose-50']

// Варианты анимации для контейнера колонок
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
      delayChildren: 0.1
    }
  },
  exit: {
    opacity: 0,
    transition: { duration: 0.2 }
  }
}

// Варианты анимации для столбца (колонка всплывает снизу)
const columnVariants: Variants = {
  hidden: { 
    y: 100,
    opacity: 0,
  },
  visible: { 
    y: 0, 
    opacity: 1,
    transition: {
      type: "spring",
      stiffness: 70,
      damping: 15,
      mass: 1
    }
  }
}

export function ProblemSolutionSection({ slides, sectionTitle = "Видеопродакшн без головной боли" }: ProblemSolutionSectionProps) {
  const [currentIndex, setCurrentIndex] = useState(0)

  // Преобразуем входящие данные в формат для рендера
  const carouselItems = useMemo(() => {
    // Если есть данные из Sanity, используем их
    if (slides && slides.length > 0) {
      return slides.map((slide, index) => {
        // Распределяем изображения (или плейсхолдеры) по 7 колонкам
        const columns = Array.from({ length: 7 }).map((_, colIdx) => {
          return Array.from({ length: 2 }).map((_, itemIdx) => {
            // Вычисляем индекс картинки в плоском массиве
            const flatIdx = (colIdx * 2 + itemIdx) % (slide.images?.length || 1)
            const imageUrl = slide.images?.[flatIdx] || null // Если картинок нет, будет null
            
            // Берем стиль высоты из шаблона
            const heightClass = GRID_TEMPLATES[colIdx % GRID_TEMPLATES.length][itemIdx]
            // Фоновый цвет для подложки
            const bgClass = BG_COLORS[index % BG_COLORS.length]
            
            return {
              className: `${bgClass} ${heightClass}`,
              imageUrl
            }
          })
        })

        return {
          id: index, // Используем индекс как ID для корректной работы точек
          title: slide.title,
          columns
        }
      })
    }

    // Иначе используем дефолтные данные
    return DEFAULT_ITEMS.map((item, index) => {
      const columns = GRID_TEMPLATES.map((colTemplate, colIdx) => {
        return colTemplate.map((heightClass) => ({
          className: `${BG_COLORS[index % BG_COLORS.length]} ${heightClass}`,
          imageUrl: DEFAULT_PLACEHOLDER
        }))
      })

      return {
        ...item,
        columns
      }
    })
  }, [slides])

  // Эффект для автоматического переключения слайдов
  useEffect(() => {
    if (carouselItems.length <= 1) return

    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % carouselItems.length)
    }, 6000)

    return () => clearInterval(timer)
  }, [carouselItems.length])

  const activeItem = carouselItems[currentIndex]

  return (
    <section id="problem-solution" className="snap-section py-20 lg:py-24 bg-neutral-50 overflow-hidden min-h-screen flex flex-col justify-center">
      <div className="container-custom">
        
        {/* Центральный заголовок */}
        <div className="text-center mb-8 relative z-10">
          <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-neutral-900 mb-6">
            {sectionTitle}
          </h2>
          
          {/* Анимированный подзаголовок (текущий блок) */}
          <div className="h-16 flex items-center justify-center">
             <AnimatePresence mode="wait">
              <motion.div
                key={activeItem.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.4 }}
                className="text-center"
              >
                {/* Приятный синий цвет для текста слайда - используем blue-600 */}
                <h3 className="text-3xl md:text-5xl font-bold text-blue-600">
                  {activeItem.title}
                </h3>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>

        {/* Карусель "Pinterest" блоков (7 столбцов) */}
        <div className="max-w-[1400px] mx-auto mt-8 relative">
          
          {/* Градиентные маски сверху и снизу для плавного ухода */}
          <div className="absolute top-0 left-0 right-0 h-20 bg-gradient-to-b from-neutral-50 to-transparent z-10 pointer-events-none" />
          <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-neutral-50 to-transparent z-10 pointer-events-none" />

          <AnimatePresence mode="wait">
            <motion.div
              key={activeItem.id}
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4 px-4"
            >
              {/* Рендерим 7 столбцов, но скрываем лишние на мобильных */}
              {activeItem.columns.map((column, colIdx) => (
                <motion.div
                  key={`col-${colIdx}`}
                  variants={columnVariants}
                  className={cn(
                    "flex flex-col gap-4",
                    // Смещение для masonry эффекта: четные столбцы сдвинуты вниз
                    colIdx % 2 !== 0 ? "mt-12" : "mt-0",
                    // Адаптивное скрытие:
                    // 0-1: visible always
                    // 2-3: hidden on mobile, visible on md+
                    // 4-6: hidden on mobile/tablet, visible on lg+
                    colIdx >= 2 && colIdx < 4 && "hidden md:flex",
                    colIdx >= 4 && "hidden lg:flex"
                  )}
                >
                  {/* В каждом столбце по 2 картинки */}
                  {column.map((card, cardIdx) => (
                    <div
                      key={`card-${colIdx}-${cardIdx}`}
                      className={cn(
                        "relative rounded-2xl overflow-hidden shadow-sm w-full transform transition-all hover:scale-[1.02]",
                        card.className
                      )}
                    >
                      {/* Изображение - рендерим только если есть валидный URL */}
                      {card.imageUrl && (
                        <Image
                          src={card.imageUrl}
                          alt="Portfolio item"
                          fill
                          className="object-cover"
                          sizes="(max-width: 768px) 50vw, (max-width: 1200px) 25vw, 15vw"
                        />
                      )}
                      
                      {/* Легкий градиент для объема поверх изображения */}
                      <div className="absolute inset-0 bg-gradient-to-tr from-black/5 to-transparent pointer-events-none" />
                    </div>
                  ))}
                </motion.div>
              ))}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Индикаторы прогресса */}
        <div className="flex justify-center gap-3 mt-16 z-20 relative">
          {carouselItems.map((item, idx) => (
            <div 
              key={item.id}
              className={cn(
                "h-2 rounded-full transition-all duration-500",
                idx === currentIndex ? "w-10 bg-primary-600" : "w-2 bg-neutral-300"
              )}
            />
          ))}
        </div>

      </div>
    </section>
  )
}
