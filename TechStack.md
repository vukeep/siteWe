# StudioWe Technical Stack

## 1. Общая архитектура
- **Фреймворк**: Next.js 16 + React 19 + TypeScript. Режим `app router` с гибридом SSG/ISR для лендинга и SSR/Route Handlers для форм.
- **Рендеринг**: статическая генерация (SSG) для основных экранов, тарифов и портфолио; инкрементальная регенерация (ISR) для обновляемых блоков; легкие API-роуты для заявок.
- **Монорепозиторий**: один Next.js репозиторий со структурой `src/` и выделенными доменами (`modules/landing`, `modules/portfolio`, `modules/forms`).

## 2. Фронтенд
- **React 19 + Server Components** для экранов с данными из CMS.
- **Client Components** для интерактивных блоков: галерея, тарифные слайдеры, FAQ-аккордеоны, формы.
- **Routing**: file-based маршруты Next.js, динамический маршрут `/portfolio/[slug]` для отдельных кейсов.

## 3. Стили и дизайн-система
- **Tailwind CSS** для utility-классов, тема настроена через `tailwind.config.ts`.
- **Кастомная дизайн-система**: токены в `tokens.json` → синхронизация с Tailwind (цвета, шрифты, скругления, тени).
- **shadcn/ui** как база форм, диалогов, табов; компоненты переименовываются под дизайн (`@/components/ui/*`).
- **Типографика**: кастомный variable font, подключенный через `next/font`.

## 4. Анимации и интерактив
- **Motion (ex-Framer Motion)**: сцены появления блоков, анимированные плитки форматов роликов, скролл-анимации галереи.
- **React Spring / Lenis (опционально)** для плавного скролла и параллакса на первом экране.
- **Intersection Observer hooks** для lazy-load видео превью и запуска анимаций.

## 5. Контент и CMS
- **Headless CMS**:
  - *Sanity*: SaaS, real-time preview, GROQ-запросы, webhooks для ISR.
  - *Strapi/Payload*: self-hosted Node, REST/GraphQL API, кастомные роли.
- **Сущности**: hero-блок, услуги, форматы роликов, портфолио, тарифы, FAQ, контакты, формы CTA.
- **Синхронизация**: при билде `getStaticProps` тянет данные; webhooks вызывают `/api/revalidate`.

## 6. Формы, валидация, лиды
- **React Hook Form + Zod**: единая схема для формы заявки и CTA.
- **Next.js Route Handlers** в `/app/api/lead/route.ts`:
  - запись в CRM/Notion/Google Sheets через REST-клиент,
  - уведомления (SMTP, Telegram bot).
- **reCAPTCHA v3 / hCaptcha** для антиспама.

## 7. Медиа и портфолио
- **Cloudinary**: хранение вертикальных видео и постеров, трансформация под webp/mp4/hls.
- **Next.js Image / Video components** c CDN Cloudinary.
- **Metadata**: теги (маркетинг, HR, бренд), описания, CTA для каждого видео.

## 8. Бэкенд и инфраструктура
- **Next.js standalone build** в Docker.
- **Nginx** как reverse-proxy (TLS, gzip, HTTP/2, кеширование статики).
- **Docker Compose**: сервисы `web`, `cms` (если self-hosted), `proxy`.
- **CI/CD**: GitHub Actions → сборка, линты, тесты, push образа в Registry → деплой на сервер.

## 9. Инструменты разработки и качество
- **ESLint + @typescript-eslint + next/core-web-vitals**.
- **Prettier** с Tailwind plugin для сортировки классов.
- **Vitest / Jest + React Testing Library** для критичных компонентов.
- **Storybook** (или shadcn playground) для UI регрессий и согласования дизайна.
- **Playwright** для smoke-тестов форм и CTA.

## 10. Об observability и аналитике
- **Vercel Analytics / Posthog** для поведения пользователей.
- **Sentry** для ошибок фронтенда и API.
- **UptimeRobot / Healthcheck** для мониторинга продакшена.

## 11. Безопасность и соответсвие
- HTTPS везде, HSTS через Nginx.
- ENV-ключи через `.env.local` + секреты в CI.
- Логи доступа/заявок в защищенное хранилище (S3/Cloud Storage).

## 12. Будущие расширения
- Поддержка многоязычности через `@lingui` или `next-intl`.
- Интеграция с CRM (HubSpot/Pipedrive) для автоматизации лидов.
- Генерация персонализированных видео ссылок (share pages) на основе CMS данных.
