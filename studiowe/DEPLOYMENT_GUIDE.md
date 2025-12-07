# 🚀 Руководство по развертыванию StudioWe

## Содержание
1. [Предварительные требования](#предварительные-требования)
2. [Локальная разработка](#локальная-разработка)
3. [Развертывание на Vercel](#развертывание-на-vercel)
4. [Environment Variables](#environment-variables)
5. [Post-Deploy Настройка](#post-deploy-настройка)
6. [Интеграция с CMS](#интеграция-с-cms)
7. [Мониторинг и Аналитика](#мониторинг-и-аналитика)
8. [Troubleshooting](#troubleshooting)

---

## Предварительные требования

### Необходимое ПО
- **Node.js**: v18+ (рекомендуется LTS версия)
- **npm**: v9+ или **pnpm** / **yarn**
- **Git**: для version control

### Аккаунты
- [Vercel](https://vercel.com) — для hosting
- [Cloudinary](https://cloudinary.com) — для медиа хостинга
- [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) (опционально) — для Payload CMS
- [Telegram](https://telegram.org) (опционально) — для уведомлений

---

## Локальная разработка

### 1. Клонирование репозитория

```bash
git clone https://github.com/your-username/studiowe.git
cd studiowe
```

### 2. Установка зависимостей

```bash
npm install
```

### 3. Создание `.env.local`

Создайте файл `.env.local` в корне проекта:

```bash
# Обязательные переменные
NEXT_PUBLIC_SITE_URL=http://localhost:3000

# Cloudinary (для медиа)
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret

# Опциональные переменные (для будущего)
# PAYLOAD_SECRET=your-payload-secret
# MONGODB_URI=mongodb+srv://...
# TELEGRAM_BOT_TOKEN=your-bot-token
# TELEGRAM_CHAT_ID=your-chat-id
# SENTRY_DSN=your-sentry-dsn
```

### 4. Запуск dev сервера

```bash
npm run dev
```

Откройте [http://localhost:3000](http://localhost:3000) в браузере.

### 5. Production билд (локально)

```bash
npm run build
npm run start
```

---

## Развертывание на Vercel

### Вариант 1: Через Vercel Dashboard (рекомендуется)

1. **Войдите в Vercel**
   - Перейдите на [vercel.com](https://vercel.com)
   - Войдите через GitHub/GitLab/Bitbucket

2. **Импортируйте проект**
   - Нажмите "Add New Project"
   - Выберите репозиторий `studiowe`
   - Vercel автоматически определит Next.js

3. **Настройте Environment Variables**
   - В разделе "Environment Variables" добавьте все переменные из `.env.local`
   - **Важно**: для `NEXT_PUBLIC_*` переменных установите для всех окружений (Production, Preview, Development)

4. **Deploy**
   - Нажмите "Deploy"
   - Дождитесь завершения билда (~2-3 минуты)
   - Получите production URL: `https://your-project.vercel.app`

### Вариант 2: Через Vercel CLI

```bash
# Установка Vercel CLI
npm install -g vercel

# Вход в аккаунт
vercel login

# Deploy в production
vercel --prod

# Следуйте инструкциям в терминале
```

### Вариант 3: Автоматический Deploy через Git

1. **Подключите репозиторий к Vercel**
   - Импортируйте проект как в Варианте 1

2. **Настройте Auto-Deploy**
   - Vercel автоматически создаст деплои при:
     - Push в `main` → Production deploy
     - Pull Request → Preview deploy
     - Push в другие ветки → Development deploy

3. **Проверьте GitHub Integration**
   - В настройках проекта → "Git" → Убедитесь, что интеграция активна

---

## Environment Variables

### Обязательные переменные

| Переменная | Описание | Где взять |
|------------|----------|-----------|
| `NEXT_PUBLIC_SITE_URL` | URL вашего сайта | `https://studiowe.com` или `https://your-project.vercel.app` |
| `CLOUDINARY_CLOUD_NAME` | Cloudinary cloud name | [Cloudinary Dashboard](https://cloudinary.com/console) |
| `CLOUDINARY_API_KEY` | Cloudinary API key | [Cloudinary Dashboard](https://cloudinary.com/console) → Settings → Security |
| `CLOUDINARY_API_SECRET` | Cloudinary API secret | То же самое |

### Опциональные переменные (для будущей интеграции)

| Переменная | Описание | Когда нужна |
|------------|----------|-------------|
| `PAYLOAD_SECRET` | Секрет для Payload CMS | При интеграции CMS |
| `MONGODB_URI` | MongoDB connection string | При интеграции CMS |
| `TELEGRAM_BOT_TOKEN` | Token Telegram бота | Для уведомлений о заявках |
| `TELEGRAM_CHAT_ID` | ID чата для уведомлений | Для уведомлений о заявках |
| `SENTRY_DSN` | Sentry DSN для мониторинга | Для error tracking |

### Как добавить переменные в Vercel

**Через Dashboard**:
1. Откройте проект → Settings → Environment Variables
2. Нажмите "Add New"
3. Введите `Name` и `Value`
4. Выберите окружения (Production, Preview, Development)
5. Сохраните

**Через CLI**:
```bash
vercel env add NEXT_PUBLIC_SITE_URL production
# Введите значение и подтвердите
```

**Важно**: После добавления переменных **пересоздайте деплой**!

```bash
vercel --prod --force
```

---

## Post-Deploy Настройка

### 1. Настройка кастомного домена

1. **Купите домен** (например, на Namecheap, GoDaddy, REG.RU)
2. **Добавьте домен в Vercel**:
   - Проект → Settings → Domains
   - Введите `studiowe.com`
   - Следуйте инструкциям по настройке DNS
3. **Обновите DNS записи**:
   - Добавьте A-запись: `76.76.21.21` (Vercel IP)
   - Или CNAME: `cname.vercel-dns.com`
4. **Подождите propagation** (~24 часа, обычно быстрее)

### 2. Настройка SSL

Vercel автоматически выдает SSL сертификат для вашего домена (Let's Encrypt).

**Проверка**:
- Откройте `https://studiowe.com`
- Убедитесь, что сертификат валидный

### 3. Обновите NEXT_PUBLIC_SITE_URL

После настройки домена обновите переменную:

```bash
NEXT_PUBLIC_SITE_URL=https://studiowe.com
```

И пересоздайте деплой.

### 4. Проверьте SEO

**Sitemap**:
- Откройте `https://studiowe.com/sitemap.xml`
- Убедитесь, что все страницы перечислены

**Robots.txt**:
- Откройте `https://studiowe.com/robots.txt`
- Проверьте правила для ботов

**Google Search Console**:
1. Перейдите на [search.google.com/search-console](https://search.google.com/search-console)
2. Добавьте свой домен
3. Подтвердите владение (через DNS или HTML файл)
4. Отправьте sitemap: `https://studiowe.com/sitemap.xml`

**Yandex Webmaster**:
1. Перейдите на [webmaster.yandex.ru](https://webmaster.yandex.ru)
2. Добавьте свой домен
3. Подтвердите владение
4. Отправьте sitemap

---

## Интеграция с CMS

### Payload CMS (опционально)

#### 1. Настройка MongoDB Atlas

1. **Создайте аккаунт** на [mongodb.com/cloud/atlas](https://www.mongodb.com/cloud/atlas)
2. **Создайте кластер**:
   - Выберите Free tier (M0)
   - Регион: ближайший к вашим пользователям
3. **Создайте пользователя базы данных**:
   - Database Access → Add New Database User
   - Username: `studiowe_admin`
   - Password: сгенерируйте сильный пароль
4. **Добавьте IP в whitelist**:
   - Network Access → Add IP Address
   - Allow Access from Anywhere: `0.0.0.0/0` (для Vercel)
5. **Получите Connection String**:
   - Clusters → Connect → Connect your application
   - Скопируйте URI: `mongodb+srv://studiowe_admin:<password>@cluster0.xxxxx.mongodb.net/studiowe?retryWrites=true&w=majority`
   - Замените `<password>` на ваш пароль

#### 2. Установка Payload CMS

```bash
npm install payload @payloadcms/next @payloadcms/db-mongodb
```

#### 3. Конфигурация Payload

Создайте `src/payload.config.ts`:

```typescript
import { buildConfig } from 'payload/config'
import { mongooseAdapter } from '@payloadcms/db-mongodb'

export default buildConfig({
  serverURL: process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000',
  admin: {
    user: 'users',
  },
  collections: [
    // Коллекция "Лиды"
    {
      slug: 'leads',
      fields: [
        { name: 'name', type: 'text', required: true },
        { name: 'company', type: 'text', required: true },
        { name: 'phone', type: 'text', required: true },
        { name: 'email', type: 'email', required: true },
        { name: 'task', type: 'textarea', required: true },
        { name: 'requestType', type: 'select', options: ['general', 'portfolio_request', 'pricing_calculation'] },
        { name: 'status', type: 'select', options: ['new', 'contacted', 'converted', 'rejected'], defaultValue: 'new' },
      ],
    },
    // Коллекция "Портфолио"
    {
      slug: 'portfolio',
      fields: [
        { name: 'title', type: 'text', required: true },
        { name: 'slug', type: 'text', required: true, unique: true },
        { name: 'description', type: 'textarea', required: true },
        { name: 'category', type: 'select', options: ['marketing', 'ecommerce', 'education', 'brand', 'ai-characters', 'series'] },
        { name: 'videoUrl', type: 'text', required: true },
        { name: 'posterUrl', type: 'text', required: true },
        { name: 'duration', type: 'number', required: true },
        { name: 'tags', type: 'array', fields: [{ name: 'tag', type: 'text' }] },
        { name: 'featured', type: 'checkbox', defaultValue: false },
        { name: 'viewCount', type: 'number', defaultValue: 0 },
      ],
    },
  ],
  db: mongooseAdapter({
    url: process.env.MONGODB_URI!,
  }),
  secret: process.env.PAYLOAD_SECRET!,
})
```

#### 4. Обновите Environment Variables

```bash
PAYLOAD_SECRET=your-strong-random-secret
MONGODB_URI=mongodb+srv://...
```

#### 5. Запустите Payload Admin

```bash
npm run dev
```

Откройте `http://localhost:3000/admin` и создайте первого пользователя.

#### 6. Интегрируйте с API

Обновите `src/app/api/lead/route.ts`:

```typescript
import payload from 'payload'

export async function POST(req: Request) {
  const data = await req.json()
  
  // Сохранение в Payload CMS
  const lead = await payload.create({
    collection: 'leads',
    data: {
      name: data.name,
      company: data.company,
      phone: data.phone,
      email: data.email,
      task: data.task,
      requestType: data.requestType,
      status: 'new',
    },
  })
  
  // ... остальная логика
}
```

---

## Мониторинг и Аналитика

### Vercel Analytics

1. **Включите в Dashboard**:
   - Проект → Analytics → Enable
2. **Просмотр метрик**:
   - Real-time visitors
   - Page views
   - Top pages

### Sentry (Error Monitoring)

1. **Создайте проект** на [sentry.io](https://sentry.io)
2. **Установите SDK**:

```bash
npm install @sentry/nextjs
```

3. **Инициализируйте Sentry**:

```bash
npx @sentry/wizard -i nextjs
```

4. **Добавьте DSN** в Environment Variables:

```bash
SENTRY_DSN=https://xxxxx@xxxxx.ingest.sentry.io/xxxxx
```

### Google Analytics 4

1. **Создайте property** на [analytics.google.com](https://analytics.google.com)
2. **Получите Measurement ID**: `G-XXXXXXXXXX`
3. **Добавьте скрипт** в `src/app/layout.tsx`:

```typescript
import Script from 'next/script'

export default function RootLayout({ children }) {
  return (
    <html lang="ru">
      <head>
        <Script
          src={`https://www.googletagmanager.com/gtag/js?id=${process.env.NEXT_PUBLIC_GA_ID}`}
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '${process.env.NEXT_PUBLIC_GA_ID}');
          `}
        </Script>
      </head>
      <body>{children}</body>
    </html>
  )
}
```

4. **Добавьте в Environment Variables**:

```bash
NEXT_PUBLIC_GA_ID=G-XXXXXXXXXX
```

---

## Troubleshooting

### Проблема: Build Failed на Vercel

**Решение**:
1. Проверьте логи билда в Vercel Dashboard
2. Убедитесь, что все Environment Variables добавлены
3. Запустите `npm run build` локально для проверки
4. Проверьте версию Node.js (должна быть 18+)

### Проблема: Изображения не загружаются

**Решение**:
1. Проверьте `next.config.ts` → `remotePatterns`
2. Убедитесь, что Cloudinary настроен правильно
3. Проверьте URL изображений в браузере

### Проблема: Формы не отправляются

**Решение**:
1. Проверьте API endpoint: `https://your-domain.com/api/lead`
2. Откройте DevTools → Network → проверьте response
3. Убедитесь, что валидация проходит (Zod)
4. Проверьте CORS настройки (если API на другом домене)

### Проблема: Sitemap не обновляется

**Решение**:
1. Пересоздайте деплой на Vercel
2. Проверьте `src/app/sitemap.ts`
3. Очистите кэш браузера
4. Используйте ISR: `POST /api/revalidate?secret=YOUR_SECRET&path=/sitemap.xml`

### Проблема: Высокий LCP (медленная загрузка)

**Решение**:
1. Оптимизируйте изображения (используйте WebP)
2. Включите lazy loading для видео
3. Уменьшите размер bundle (code splitting)
4. Используйте CDN для статических файлов
5. Проверьте через Lighthouse

---

## 🎉 Готово!

Ваш сайт StudioWe готов к production использованию!

**Что дальше**:
1. ✅ Замените mock данные на реальный контент
2. ✅ Загрузите реальные видео на Cloudinary
3. ✅ Настройте Telegram уведомления
4. ✅ Интегрируйте Payload CMS (если нужно)
5. ✅ Мониторьте производительность и ошибки

**Полезные ссылки**:
- [Vercel Documentation](https://vercel.com/docs)
- [Next.js Documentation](https://nextjs.org/docs)
- [Cloudinary Documentation](https://cloudinary.com/documentation)
- [Payload CMS Documentation](https://payloadcms.com/docs)

**Поддержка**:
- 📧 Email: hello@studiowe.com
- 💬 Telegram: @studiowe

---

*Последнее обновление: 6 декабря 2024*
