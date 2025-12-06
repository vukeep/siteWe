/**
 * Переиспользуемые motion variants для Framer Motion
 * 
 * Оптимизированы для производительности:
 * - Использование transform вместо top/left
 * - GPU-ускоренные свойства
 * - Плавные easing функции
 */

/**
 * Fade In Up - появление снизу с плавным проявлением
 * Используется для секций и карточек при скролле
 */
export const fadeInUp = {
  initial: {
    opacity: 0,
    y: 20,
  },
  animate: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: [0.25, 0.46, 0.45, 0.94], // easeOutQuad
    },
  },
  exit: {
    opacity: 0,
    y: 20,
    transition: {
      duration: 0.3,
    },
  },
}

/**
 * Fade In - простое появление
 * Используется для оверлеев и модальных окон
 */
export const fadeIn = {
  initial: {
    opacity: 0,
  },
  animate: {
    opacity: 1,
    transition: {
      duration: 0.3,
      ease: 'easeOut',
    },
  },
  exit: {
    opacity: 0,
    transition: {
      duration: 0.2,
    },
  },
}

/**
 * Scale In - появление с увеличением
 * Используется для кнопок и интерактивных элементов
 */
export const scaleIn = {
  initial: {
    opacity: 0,
    scale: 0.95,
  },
  animate: {
    opacity: 1,
    scale: 1,
    transition: {
      duration: 0.3,
      ease: [0.34, 1.56, 0.64, 1], // easeOutBack
    },
  },
  exit: {
    opacity: 0,
    scale: 0.95,
    transition: {
      duration: 0.2,
    },
  },
}

/**
 * Slide In Left - въезд слева
 * Используется для боковых панелей и меню
 */
export const slideInLeft = {
  initial: {
    x: -100,
    opacity: 0,
  },
  animate: {
    x: 0,
    opacity: 1,
    transition: {
      duration: 0.4,
      ease: [0.25, 0.46, 0.45, 0.94],
    },
  },
  exit: {
    x: -100,
    opacity: 0,
    transition: {
      duration: 0.3,
    },
  },
}

/**
 * Slide In Right - въезд справа
 * Используется для боковых панелей и меню
 */
export const slideInRight = {
  initial: {
    x: 100,
    opacity: 0,
  },
  animate: {
    x: 0,
    opacity: 1,
    transition: {
      duration: 0.4,
      ease: [0.25, 0.46, 0.45, 0.94],
    },
  },
  exit: {
    x: 100,
    opacity: 0,
    transition: {
      duration: 0.3,
    },
  },
}

/**
 * Stagger Container - контейнер с последовательной анимацией детей
 * Используется для списков и сеток элементов
 */
export const staggerContainer = {
  animate: {
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2,
    },
  },
}

/**
 * Stagger Item - элемент для stagger контейнера
 */
export const staggerItem = {
  initial: {
    opacity: 0,
    y: 20,
  },
  animate: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
    },
  },
}

/**
 * Hover Scale - увеличение при наведении
 * Используется для карточек и кнопок
 */
export const hoverScale = {
  rest: {
    scale: 1,
  },
  hover: {
    scale: 1.05,
    transition: {
      duration: 0.3,
      ease: 'easeOut',
    },
  },
  tap: {
    scale: 0.95,
  },
}

/**
 * Drawer Variants - для выдвижных панелей
 */
export const drawerVariants = {
  open: {
    x: 0,
    transition: {
      type: 'spring',
      stiffness: 300,
      damping: 30,
    },
  },
  closed: {
    x: '100%',
    transition: {
      type: 'spring',
      stiffness: 300,
      damping: 30,
    },
  },
}

/**
 * Modal Backdrop - для затемнения фона модальных окон
 */
export const modalBackdrop = {
  initial: {
    opacity: 0,
  },
  animate: {
    opacity: 1,
    transition: {
      duration: 0.2,
    },
  },
  exit: {
    opacity: 0,
    transition: {
      duration: 0.2,
    },
  },
}

/**
 * Progress Bar - для индикаторов прогресса
 */
export const progressBar = {
  initial: {
    scaleX: 0,
    originX: 0,
  },
  animate: {
    scaleX: 1,
    transition: {
      duration: 1,
      ease: 'easeOut',
    },
  },
}

