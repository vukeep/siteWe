# 📘 Руководство по интеграции Sanity CMS

**Дата**: 6 декабря 2024  
**Проект**: StudioWe  
**Статус**: ✅ Интеграция завершена

---

## 📋 Обзор интеграции

Sanity CMS интегрирован в проект для управления:
- **Портфолио проектами** (видео, описания, категории)
- **Заявками клиентов** (leads с формы сайта)

### Архитектура

```
Next.js App (Vercel) ← ISR → Sanity Content Lake → Cloudinary (media)
        ↓
  /admin → Sanity Studio (встроенная админка)
```

---

## 🚀 Быстрый старт

### 1. Установка зависимостей

```bash
cd studiowe
npm install
```

### 2. Создание Sanity проекта

```bash
# Установить Sanity CLI глобально
npm install -g @sanity/cli

# Войти в Sanity
sanity login

# Создать новый проект
sanity init --project-name studiowe --dataset production
```

Это создаст проект в Sanity.io и выдаст:
- `projectId` - ID проекта
- `dataset` - Название датасета (production)

### 3. Настройка Environment Variables

Создайте/обновите `.env.local`:

```env
# Sanity CMS
NEXT_PUBLIC_SANITY_PROJECT_ID=ваш_project_id
NEXT_PUBLIC_SANITY_DATASET=production
SANITY_API_TOKEN=ваш_токен_с_правами_записи
SANITY_WEBHOOK_SECRET=случайная_строка_для_webhook

# Existing variables
NEXT_PUBLIC_SITE_URL=https://studiowe.com
CLOUDINARY_CLOUD_NAME=your_cloud
CLOUDINARY_API_KEY=your_key
CLOUDINARY_API_SECRET=your_secret
```

**Получение SANITY_API_TOKEN**:
1. Перейдите на [sanity.io/manage](https://sanity.io/manage)
2. Выберите свой проект
3. API → Tokens → Add API token
4. Name: "StudioWe Production", Permissions: "Editor"
5. Скопируйте токен

### 4. Настройка CORS в Sanity

1. [sanity.io/manage](https://sanity.io/manage) → Ваш проект → API
2. CORS Origins → Add CORS origin
3. Добавьте:
   - `http://localhost:3000` (для локальной разработки)
   - `https://studiowe.com` (production)
   - `https://*.vercel.app` (preview deployments)

### 5. Миграция данных

```bash
# Запустить миграцию mock данных в Sanity
npm run migrate
```

Это перенесет 8 проектов из `portfolio-mock.ts` в Sanity CMS.

### 6. Запуск проекта

```bash
npm run dev
```

Откройте:
- **Сайт**: http://localhost:3000
- **Sanity Studio**: http://localhost:3000/admin

---

## 🎨 Использование Sanity Studio

### Доступ к админке

1. Откройте http://localhost:3000/admin
2. Войдите через Google/GitHub (настроено в Sanity)
3. Увидите две секции:
   - 🎬 **Портфолио** - управление проектами
   - 📝 **Заявки** - просмотр заявок с форм

### Создание проекта портфолио

1. Портфолио → Create → Portfolio
2. Заполните поля:
   - **Название**: "Рекламный ролик для SaaS"
   - **URL slug**: Автоматически из названия или вручную
   - **Описание**: Краткое описание проекта
   - **Категория**: Выберите из списка
   - **URL видео**: Вставьте URL из Cloudinary
   - **URL постера**: URL превью из Cloudinary
   - **Длительность**: В секундах (например, 30)
   - **Теги**: Добавьте теги через Enter
   - **Избранное**: ✅ для показа на главной
   - **Дата публикации**: Автоматически или выберите
   - **Просмотры**: Начальное значение 0
3. Нажмите **Publish**

### Просмотр заявок

1. Заявки → Откроется список всех заявок
2. Кликните на заявку для просмотра деталей
3. Измените статус: Новая → В работе → Завершена
4. Добавьте примечания для команды

---

## 🔄 Автоматическое обновление контента (ISR + Webhooks)

### Как работает

```
Изменение в Sanity → Webhook → Next.js API → Revalidate cache → Обновленный контент
```

**Время обновления**: 1-5 секунд после Publish в Sanity!

### Настройка Webhook в Sanity

1. [sanity.io/manage](https://sanity.io/manage) → Ваш проект → API → Webhooks
2. Create webhook:
   - **Name**: "StudioWe Revalidation"
   - **URL**: `https://studiowe.com/api/sanity-webhook?secret=ваш_SANITY_WEBHOOK_SECRET`
   - **Dataset**: production
   - **Trigger on**: Create, Update, Delete
   - **Filter**: `_type == "portfolio"`
   - **HTTP method**: POST
   - **API version**: v2024-01-01
3. Save webhook

### Проверка работы webhook

```bash
# Локально (используйте ngrok для тестирования)
curl http://localhost:3000/api/sanity-webhook?secret=your_secret \
  -X POST \
  -H "Content-Type: application/json" \
  -d '{"_type":"portfolio","slug":{"current":"test-project"}}'
```

---

## 📊 Структура данных

### Portfolio Schema

```typescript
{
  _type: 'portfolio',
  title: string,           // Название проекта
  slug: {                  // URL slug
    _type: 'slug',
    current: string
  },
  description: string,     // Описание
  category: string,        // marketing | ecommerce | education | brand | ai-characters | series
  videoUrl: string,        // URL видео из Cloudinary
  posterUrl: string,       // URL постера из Cloudinary
  duration: number,        // Длительность в секундах
  tags: string[],          // Массив тегов
  featured: boolean,       // Показывать на главной?
  publishedAt: datetime,   // Дата публикации
  viewCount: number        // Количество просмотров
}
```

### Lead Schema

```typescript
{
  _type: 'lead',
  name: string,            // Имя клиента
  company: string,         // Название компании
  phone: string,           // Телефон
  email: string,           // Email
  task: string,            // Описание задачи
  requestType: string,     // general | portfolio_request | pricing_calculation
  videoCount?: string,     // Количество роликов (опционально)
  status: string,          // new | in_progress | completed
  createdAt: datetime,     // Дата создания
  notes?: string           // Примечания команды
}
```

---

## 🧪 Тестирование

### Проверка Sanity Studio

1. Откройте http://localhost:3000/admin
2. Создайте тестовый проект
3. Убедитесь, что все поля сохраняются

### Проверка отображения на сайте

1. Откройте http://localhost:3000
2. Проверьте секцию "Наши работы" - новый проект должен появиться
3. Перейдите на http://localhost:3000/portfolio
4. Найдите новый проект в списке
5. Кликните на проект → откроется детальная страница

### Проверка ISR ревалидации

1. Откройте существующий проект в Sanity Studio
2. Измените название или описание
3. Нажмите Publish
4. Обновите страницу проекта на сайте (F5)
5. Изменения должны появиться в течение 1-5 секунд

### Проверка заявок

1. Откройте http://localhost:3000
2. Заполните контактную форму
3. Отправьте заявку
4. Откройте http://localhost:3000/admin → Заявки
5. Новая заявка должна появиться в списке

---

## 🚀 Deployment на Vercel

### 1. Environment Variables в Vercel

В Vercel Dashboard → Settings → Environment Variables добавьте:

```
NEXT_PUBLIC_SANITY_PROJECT_ID
NEXT_PUBLIC_SANITY_DATASET
SANITY_API_TOKEN
SANITY_WEBHOOK_SECRET
NEXT_PUBLIC_SITE_URL
CLOUDINARY_CLOUD_NAME
CLOUDINARY_API_KEY
CLOUDINARY_API_SECRET
```

### 2. Deploy

```bash
git add .
git commit -m "feat: integrate Sanity CMS"
git push origin main
```

Vercel автоматически задеплоит проект.

### 3. Настройка Production Webhook

После деплоя обновите webhook URL в Sanity:

```
https://studiowe.com/api/sanity-webhook?secret=ваш_SANITY_WEBHOOK_SECRET
```

---

## 📝 Рекомендации

### Production Best Practices

1. **Backup данных**: Регулярно экспортируйте данные из Sanity
   ```bash
   sanity dataset export production backup.tar.gz
   ```

2. **Версионирование**: Используйте Sanity History для отката изменений

3. **Права доступа**: Настройте роли для контент-менеджеров (Free план: 2 роли)

4. **Мониторинг**: Отслеживайте webhook errors в Sanity Dashboard

5. **Rate Limits**: Free план: до 100k API requests/month

### Ограничения Free плана

- ✅ До 20 пользователей
- ✅ 2 роли доступа
- ✅ 2 датасета (только public)
- ✅ Unlimited контент
- ✅ Hosted database
- ✅ Live preview
- ⚠️ Нет приватных датасетов

**Для StudioWe этого достаточно!**

---

## 🛠️ Troubleshooting

### Ошибка: "Invalid signature" в webhook

**Решение**: Проверьте `SANITY_WEBHOOK_SECRET` в `.env.local` и в URL webhook

### Ошибка: "Project not found"

**Решение**: Проверьте `NEXT_PUBLIC_SANITY_PROJECT_ID` в `.env.local`

### Контент не обновляется на сайте

**Решение**:
1. Проверьте работу webhook в Sanity Dashboard → Webhooks → Logs
2. Проверьте логи Vercel для `/api/sanity-webhook`
3. Попробуйте ручную ревалидацию: `fetch('/api/revalidate?secret=...&path=/')`

### Sanity Studio не открывается

**Решение**:
1. Проверьте, что Sanity зависимости установлены: `npm install`
2. Проверьте `NEXT_PUBLIC_SANITY_PROJECT_ID` и `NEXT_PUBLIC_SANITY_DATASET`
3. Очистите кэш Next.js: `rm -rf .next && npm run dev`

---

## 📚 Дополнительные ресурсы

- [Sanity Documentation](https://www.sanity.io/docs)
- [GROQ Query Language](https://www.sanity.io/docs/groq)
- [Next.js + Sanity Guide](https://www.sanity.io/guides/nextjs-app-router)
- [Sanity Community](https://www.sanity.io/community)

---

**Интеграция завершена! 🎉**

Теперь контент-менеджер может управлять портфолио без программирования.


