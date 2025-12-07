import { notFound } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import type { Metadata } from 'next'
import { getPortfolioItemBySlug, getAllPortfolioSlugs, getRelatedProjects, getPortfolioMetadata } from '@/lib/sanity/queries'
import { formatDate } from '@/lib/utils'
import { VideoPlayer } from '@/components/ui/VideoPlayer'

/**
 * Детальная страница проекта портфолио
 * 
 * Server Component с данными из Sanity CMS.
 * 
 * Features:
 * - SSG с generateStaticParams для всех проектов
 * - Динамические SEO метаданные из Sanity
 * - Видео плеер с постером
 * - Метаданные проекта
 * - Связанные проекты той же категории
 * - CTA форма
 */

interface Props {
  params: Promise<{ slug: string }>
}

/**
 * Генерация статических страниц для всех проектов портфолио
 * Получает список slugs из Sanity CMS
 */
export async function generateStaticParams() {
  const slugs = await getAllPortfolioSlugs()
  return slugs.map((slug) => ({
    slug,
  }))
}

/**
 * Генерация динамических SEO метаданных для каждого проекта
 * Использует легковесный запрос к Sanity только для meta полей
 */
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const metadata = await getPortfolioMetadata(slug)

  if (!metadata) {
    return {
      title: 'Проект не найден',
    }
  }

  return {
    title: metadata.title,
    description: metadata.description,
    openGraph: {
      title: metadata.title,
      description: metadata.description,
      type: 'video.other',
      images: [
        {
          url: metadata.posterUrl,
          width: 1200,
          height: 630,
          alt: metadata.title,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: metadata.title,
      description: metadata.description,
      images: [metadata.posterUrl],
    },
  }
}

export default async function PortfolioDetailPage({ params }: Props) {
  const { slug } = await params
  const item = await getPortfolioItemBySlug(slug)

  // 404 если проект не найден
  if (!item) {
    notFound()
  }

  // Получить связанные проекты той же категории
  const relatedProjects = await getRelatedProjects(slug, item.category, 3)

  // Категории на русском
  const categoryLabels: Record<string, string> = {
    marketing: 'Маркетинг и продажи',
    ecommerce: 'E-commerce',
    education: 'Обучение и HR',
    brand: 'Бренд-контент',
    'ai-characters': 'AI-персонажи',
    series: 'Серии роликов',
  }

  return (
    <main className="min-h-screen py-20 pt-32 bg-white">
      <div className="container-custom">
        {/* Breadcrumbs */}
        <nav className="mb-8 text-sm text-neutral-600">
          <Link href="/" className="hover:text-blue-600 transition-colors">
            Главная
          </Link>
          <span className="mx-2">/</span>
          <Link href="/portfolio" className="hover:text-blue-600 transition-colors">
            Портфолио
          </Link>
          <span className="mx-2">/</span>
          <span className="text-neutral-900">{item.title}</span>
        </nav>

        {/* Основной контент */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 mb-16">
          {/* Видео */}
          <div className="lg:col-span-2">
            <VideoPlayer
              videoUrl={item.videoUrl}
              posterUrl={item.posterUrl}
              title={item.title}
              priority
              controls
              muted={false}
              className="card-shadow-lg"
              aspectRatio="video"
            />

            {/* Описание проекта */}
            <div className="mt-8">
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-neutral-900 mb-4">
                {item.title}
              </h1>
              <p className="text-lg md:text-xl text-neutral-700 leading-relaxed">
                {item.description}
              </p>
            </div>
          </div>

          {/* Метаданные */}
          <div className="lg:col-span-1">
            <div className="bg-neutral-50 rounded-2xl p-6 md:p-8 card-shadow sticky top-24">
              <h3 className="text-xl font-bold text-neutral-900 mb-6">
                Информация о проекте
              </h3>

              <dl className="space-y-4">
                {/* Категория */}
                <div>
                  <dt className="text-sm font-medium text-neutral-600 mb-1">Категория</dt>
                  <dd className="text-base font-semibold text-neutral-900">
                    {categoryLabels[item.category]}
                  </dd>
                </div>

                {/* Длительность */}
                <div>
                  <dt className="text-sm font-medium text-neutral-600 mb-1">Длительность</dt>
                  <dd className="text-base font-semibold text-neutral-900">
                    {item.duration < 60
                      ? `${item.duration} секунд`
                      : `${Math.floor(item.duration / 60)} мин ${item.duration % 60} сек`}
                  </dd>
                </div>

                {/* Дата публикации */}
                <div>
                  <dt className="text-sm font-medium text-neutral-600 mb-1">Опубликовано</dt>
                  <dd className="text-base font-semibold text-neutral-900">
                    {formatDate(item.publishedAt)}
                  </dd>
                </div>

                {/* Просмотры */}
                {item.viewCount && (
                  <div>
                    <dt className="text-sm font-medium text-neutral-600 mb-1">Просмотров</dt>
                    <dd className="text-base font-semibold text-neutral-900">
                      {item.viewCount.toLocaleString('ru-RU')}
                    </dd>
                  </div>
                )}

                {/* Теги */}
                <div>
                  <dt className="text-sm font-medium text-neutral-600 mb-2">Теги</dt>
                  <dd className="flex flex-wrap gap-2">
                    {item.tags.map((tag, index) => (
                      <span
                        key={index}
                        className="px-3 py-1 bg-blue-100 text-blue-700 text-sm rounded-full"
                      >
                        {tag}
                      </span>
                    ))}
                  </dd>
                </div>
              </dl>

              {/* CTA */}
              <div className="mt-8 pt-6 border-t border-neutral-200">
                <a
                  href="#contacts"
                  className="block w-full px-6 py-4 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold text-center transition-all duration-300 shadow-lg hover:shadow-xl"
                >
                  Хочу такой же ролик
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Связанные проекты */}
        {relatedProjects.length > 0 && (
          <div className="mt-20">
            <h2 className="text-3xl md:text-4xl font-bold text-neutral-900 mb-8">
              Похожие проекты
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {relatedProjects.map((related) => (
                <Link
                  key={related.id}
                  href={`/portfolio/${related.slug}`}
                  className="group block bg-white rounded-2xl overflow-hidden card-shadow hover:card-shadow-lg transition-all duration-300 hover:-translate-y-1"
                >
                  <div className="relative aspect-video bg-neutral-900">
                    <Image
                      src={related.posterUrl}
                      alt={related.title}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                  <div className="p-6">
                    <h3 className="text-xl font-bold text-neutral-900 mb-2 group-hover:text-blue-600 transition-colors">
                      {related.title}
                    </h3>
                    <p className="text-neutral-600 line-clamp-2">
                      {related.description}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* Навигация между проектами */}
        <div className="mt-16 flex justify-between items-center border-t border-neutral-200 pt-8">
          <Link
            href="/portfolio"
            className="px-6 py-3 bg-neutral-100 hover:bg-neutral-200 text-neutral-900 rounded-lg font-medium transition-colors"
          >
            ← Все работы
          </Link>
          <a
            href="#contacts"
            className="px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold transition-colors shadow-lg"
          >
            Заказать похожий проект
          </a>
        </div>
      </div>
    </main>
  )
}

