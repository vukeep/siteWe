# 🎬 Scroll-Driven Video Formats Section

## ✨ Что это?

Современная реализация блока "Какие ролики мы создаем" с **scroll-driven анимациями**, вдохновленная дизайном Google Antigravity.

### Основная идея:
- **Левая колонка**: тезисы (форматы роликов) прокручиваются вертикально
- **Правая колонка**: sticky блок с изображением, которое меняется по мере скролла
- **Активный тезис**: подсвечивается, когда находится в центре viewport

---

## 🎯 Ключевые особенности

### ✅ Технологии
- **Framer Motion** - плавные анимации и переходы
- **Intersection Observer** - отслеживание активного элемента
- **Next.js Image** - оптимизированная загрузка изображений
- **Tailwind CSS** - адаптивная стилизация
- **TypeScript** - полная типизация

### ✅ Производительность
- ⚡ **IntersectionObserver** вместо scroll events (60 FPS)
- ⚡ **GPU-ускорение** (transform, opacity)
- ⚡ **Lazy loading** изображений
- ⚡ **Priority loading** для первого изображения
- ⚡ **Viewport animations** запускаются только один раз

### ✅ Адаптивность
- 📱 **Mobile**: 1 колонка, изображения под каждым тезисом
- 💻 **Desktop**: 2 колонки, sticky изображение справа
- 🖥️ **Large Desktop**: оптимальное использование пространства

---

## 📐 Архитектура компонента

```
VideoFormatsSection (main)
├── FormatItem (component) x6
│   ├── Иконка с анимацией
│   ├── Заголовок
│   ├── Список подкатегорий
│   └── Мобильное изображение (только mobile)
└── StickyImageDisplay (component)
    ├── Стек изображений
    ├── Информационная панель
    └── Индикаторы прогресса
```

---

## 🎨 Layout структура

### Desktop (≥ 1024px)
```
┌─────────────────────────────────────────────┐
│           Заголовок секции                  │
├───────────────────────┬─────────────────────┤
│                       │                     │
│  FormatItem 1         │   ┌──────────────┐ │
│  (прокручивается)     │   │              │ │
│                       │   │  Sticky      │ │
│  FormatItem 2 ◄───────┼───┤  Image       │ │
│  (активный)           │   │  Display     │ │
│                       │   │              │ │
│  FormatItem 3         │   └──────────────┘ │
│  (прокручивается)     │   (фиксировано)   │
│                       │                     │
│  ...                  │                     │
└───────────────────────┴─────────────────────┘
```

### Mobile (< 1024px)
```
┌─────────────────────────┐
│   Заголовок секции      │
├─────────────────────────┤
│  FormatItem 1           │
│  └── [Изображение 1]    │
├─────────────────────────┤
│  FormatItem 2           │
│  └── [Изображение 2]    │
├─────────────────────────┤
│  ...                    │
└─────────────────────────┘
```

---

## 🔧 Технические детали

### 1. Intersection Observer настройка

```typescript
const inView = useInView(ref, { 
  margin: "-40% 0px -40% 0px"
})
```

**Что это значит:**
- Элемент считается "in view" когда находится в центральной 20% зоне viewport
- Верхние 40% viewport = не активно
- Центральные 20% viewport = активно
- Нижние 40% viewport = не активно

**Зачем:**
- Точное определение активного тезиса
- Смена изображения происходит когда тезис в центре экрана

### 2. Sticky позиционирование

```css
.lg:sticky {
  position: sticky;
  top: 6rem; /* 24px * 4 */
}
```

**Как работает:**
- На desktop: блок "прилипает" к top: 24px при скролле
- На mobile: отключено (hidden lg:block)
- `will-change: transform` для оптимизации

### 3. Анимация смены изображений

```typescript
animate={{ 
  opacity: activeIndex === index ? 1 : 0,
  scale: activeIndex === index ? 1 : 0.98,
  zIndex: activeIndex === index ? 2 : 1
}}
transition={{ 
  duration: 0.6, 
  ease: [0.4, 0, 0.2, 1] // Custom cubic-bezier
}}
```

**Эффект:**
- Fade in/out (opacity)
- Легкий zoom (scale 0.98 → 1)
- Контроль z-index для правильного наложения
- Плавная кривая анимации (Material Design easing)

### 4. Адаптивная загрузка изображений

```tsx
<Image
  src={format.image}
  sizes="(min-width: 1024px) 50vw, 0vw"
  priority={index === 0}
/>
```

**Оптимизация:**
- Desktop: загружаем изображение 50% viewport width
- Mobile: не загружаем (sizes="0vw")
- Первое изображение с `priority` для Core Web Vitals

---

## 🎭 Анимации

### Появление тезисов
```typescript
initial={{ opacity: 0, x: -30 }}
whileInView={{ opacity: 1, x: 0 }}
transition={{ duration: 0.5, delay: index * 0.1 }}
viewport={{ once: true }}
```
- Появление слева с задержкой (stagger effect)
- Запускается один раз при первом появлении

### Активный индикатор
```typescript
animate={{ scaleY: isActive ? 1 : 0 }}
transition={{ duration: 0.3, ease: "easeInOut" }}
```
- Вертикальная линия слева растет/сжимается

### Иконка активного тезиса
```typescript
animate={{ 
  scale: isActive ? 1.1 : 1,
  rotate: isActive ? [0, -5, 5, 0] : 0
}}
```
- Увеличение + легкое покачивание

### Индикаторы прогресса
```typescript
className={
  activeIndex === index 
    ? "w-8 bg-white shadow-lg"    // Активный
    : "w-4 bg-white/50"            // Неактивный
}
```
- Расширяется активный индикатор

---

## 📱 Адаптивность в деталях

### Breakpoints
```css
/* Mobile-first подход */
base:    /* < 1024px */  - 1 колонка, изображения под тезисами
lg:      /* ≥ 1024px */  - 2 колонки, sticky изображение
```

### Скрытие/показ элементов

| Элемент | Mobile | Desktop |
|---------|--------|---------|
| Мобильные изображения | ✅ Показано | ❌ Скрыто |
| Sticky блок | ❌ Скрыт | ✅ Показано |
| Номер тезиса в заголовке | ✅ Показано | ❌ Скрыто |
| Номер в sticky блоке | ❌ Не актуально | ✅ Показано |

### Отступы
```css
py-20 lg:py-32    /* Вертикальные: 80px → 128px */
gap-8 lg:gap-16   /* Между колонками: 32px → 64px */
space-y-4 lg:space-y-6  /* Между тезисами: 16px → 24px */
```

---

## 🎨 Дизайн система

### Цвета активного состояния
```css
/* Активный тезис */
bg-blue-50          /* Фон */
border-blue-500     /* Рамка */
text-blue-900       /* Текст */
text-blue-600       /* Акценты */

/* Неактивный тезис */
bg-white
border-gray-200
text-neutral-900
text-gray-400
```

### Тени
```css
shadow-md        /* Неактивный тезис */
shadow-xl        /* Активный тезис */
shadow-2xl       /* Sticky изображение */
```

### Закругления
```css
rounded-2xl      /* Тезисы */
rounded-3xl      /* Sticky блок */
rounded-xl       /* Мобильные изображения */
```

---

## 📊 Данные форматов

### Структура VideoFormat
```typescript
interface VideoFormat {
  id: string              // Уникальный идентификатор
  title: string           // Заголовок категории
  icon: string            // Emoji иконка
  subcategories: string[] // Список подкатегорий
  image: string           // URL изображения (Unsplash или Cloudinary)
  description: string     // Краткое описание для подписи
}
```

### Текущие изображения
Используются placeholder изображения из **Unsplash**:
- Маркетинг: графики и аналитика
- E-commerce: товары и покупки
- Обучение: презентации
- Бренд: дизайн и креатив
- AI: технологии
- Серии: видеопроизводство

**Для production:**
Замените на реальные скриншоты ваших проектов из Cloudinary.

---

## 🚀 Производительность

### Metrics
- **LCP** (Largest Contentful Paint): < 2.5s
  - Priority loading первого изображения
  - Optimized Next.js Image component
  
- **CLS** (Cumulative Layout Shift): < 0.1
  - Fixed aspect-ratio для изображений
  - Sticky с фиксированной высотой

- **FID** (First Input Delay): < 100ms
  - IntersectionObserver вместо scroll events
  - Debounced state updates

### Оптимизации
```typescript
// 1. Lazy loading с правильными sizes
sizes="(min-width: 1024px) 50vw, 0vw"

// 2. Priority для первого изображения
priority={index === 0}

// 3. Viewport animation только один раз
viewport={{ once: true }}

// 4. GPU-ускоренные свойства
transform, opacity (не width, height, margin)

// 5. will-change hint
className="will-change-transform"
```

---

## 🔄 Как обновить данные

### Добавить новый формат
```typescript
const videoFormats: VideoFormat[] = [
  // ... существующие форматы
  {
    id: 'new-format',
    title: 'Новый формат',
    icon: '🎯',
    subcategories: [
      'Подкатегория 1',
      'Подкатегория 2',
    ],
    image: 'https://your-cdn.com/image.jpg',
    description: 'Описание нового формата'
  },
]
```

### Изменить изображение
```typescript
// Вариант 1: Unsplash
image: 'https://images.unsplash.com/photo-ID?w=800&h=600&fit=crop'

// Вариант 2: Cloudinary
image: 'https://res.cloudinary.com/your-cloud/image/upload/v123/image.jpg'

// Вариант 3: Локальное
image: '/images/formats/your-image.jpg'
```

---

## 🐛 Troubleshooting

### Проблема: Изображение не меняется
**Причина:** IntersectionObserver не срабатывает
**Решение:** 
- Проверьте margin настройки useInView
- Убедитесь что высота тезисов достаточна для срабатывания

### Проблема: Sticky не работает на mobile
**Ожидаемо:** Sticky отключен на mobile через `hidden lg:block`
**Решение:** Это правильное поведение для мобильных устройств

### Проблема: Анимации лагают
**Причина:** Анимируются не GPU-ускоренные свойства
**Решение:** Используйте только transform и opacity

### Проблема: Изображения загружаются медленно
**Причина:** Большой размер изображений
**Решение:** 
- Используйте оптимизированные изображения
- Проверьте sizes атрибут
- Используйте современные форматы (WebP, AVIF)

---

## 📈 Возможные улучшения

### 1. Параллакс эффект
Добавить легкий parallax для sticky изображения:
```typescript
const { scrollYProgress } = useScroll()
const y = useTransform(scrollYProgress, [0, 1], [0, 50])
```

### 2. Видео вместо изображений
Заменить статичные изображения на короткие видео:
```tsx
<video autoPlay loop muted playsInline>
  <source src={format.video} type="video/mp4" />
</video>
```

### 3. 3D трансформации
Добавить perspective для более глубоких эффектов:
```typescript
animate={{ 
  rotateY: isActive ? 0 : -10,
  perspective: 1000
}}
```

### 4. Сохранение состояния в URL
Добавить возможность шарить ссылку на конкретный формат:
```typescript
const [activeFormat, setActiveFormat] = useState(
  parseInt(searchParams.get('format') || '0')
)
```

---

## 📚 Связанные файлы

```
studiowe/
├── src/components/sections/
│   └── VideoFormatsSection.tsx      ← Основной файл
├── src/lib/
│   └── utils.ts                     ← cn() helper
├── public/images/formats/           ← Папка для изображений (опционально)
└── SCROLL_DRIVEN_FORMATS_GUIDE.md   ← Эта документация
```

---

## 🎓 Обучающие материалы

### Framer Motion
- [useInView Hook](https://www.framer.com/motion/use-in-view/)
- [Animation Controls](https://www.framer.com/motion/animation/)
- [Scroll Animations](https://www.framer.com/motion/scroll-animations/)

### Intersection Observer
- [MDN Documentation](https://developer.mozilla.org/en-US/docs/Web/API/Intersection_Observer_API)
- [Use Cases](https://web.dev/intersectionobserver/)

### CSS Sticky
- [CSS Tricks Guide](https://css-tricks.com/position-sticky-2/)
- [Can I Use](https://caniuse.com/css-sticky)

---

## 🎉 Результат

Вы получили:
- ✅ **Современный дизайн** как у Google Antigravity
- ✅ **Плавные анимации** с Framer Motion
- ✅ **Высокую производительность** (60 FPS)
- ✅ **Полную адаптивность** (mobile + desktop)
- ✅ **TypeScript типизацию**
- ✅ **Отличный UX** для пользователей

**Наслаждайтесь новым блоком!** 🚀

---

**Версия:** 1.0  
**Дата:** Декабрь 2024  
**Автор:** StudioWe Development Team

