import { HeroSection } from '@/components/sections/HeroSection'
import { HeroVideoSection } from '@/components/sections/HeroVideoSection'
import { ProblemSolutionSection } from '@/components/sections/ProblemSolutionSection'
import { VideoFormatsSection } from '@/components/sections/VideoFormatsSection'
import { VideoGallerySection } from '@/components/sections/VideoGallerySection'
import { ProcessSection } from '@/components/sections/ProcessSection'
import { PricingSection } from '@/components/sections/PricingSection'
import { BenefitsSection } from '@/components/sections/BenefitsSection'
import { FAQSection } from '@/components/sections/FAQSection'
import { ContactFormSection } from '@/components/sections/ContactFormSection'
import { getHomepageSettings } from '@/lib/sanity/queries'

/**
 * Главная страница StudioWe
 * 
 * Все 7 экранов сайта согласно Structure.md:
 * 1. Hero (первый экран) ✅
 * 2. Проблема/Решение ✅
 * 3. Форматы роликов ✅
 * 4. Галерея портфолио ✅
 * 5. Процесс работы (7 шагов) ✅
 * 6. Тарифы (3 пакета) ✅
 * 7. Преимущества, FAQ и контактная форма ✅
 */

export default async function HomePage() {
  // Получаем настройки главной страницы из Sanity
  const homepageSettings = await getHomepageSettings()

  // Debug: показываем статус в dev режиме
  if (process.env.NODE_ENV === 'development') {
    console.log('📊 Homepage Settings:', {
      exists: !!homepageSettings,
      enabled: homepageSettings?.heroVideoEnabled,
      hasVideoUrl: !!homepageSettings?.heroVideoUrl,
      hasPosterUrl: !!homepageSettings?.heroPosterUrl,
      data: homepageSettings,
    })
  }

  // 🧪 ВРЕМЕННО: Тестовое видео для демонстрации
  // TODO: Удалить после настройки через админку
  const testVideoEnabled = false // Поставьте true для теста
  const testVideo = {
    enabled: true,
    title: 'Смотрите, как мы создаем AI-ролики',
    videoUrl: 'https://res.cloudinary.com/avitophoto/video/upload/f_auto,q_auto/v1765009796/studiowe/images/upload_278047923_file_qpfb3i.mp4',
    posterUrl: 'https://res.cloudinary.com/avitophoto/video/upload/so_0,f_webp,q_auto/v1765009796/studiowe/images/upload_278047923_file_qpfb3i.webp',
    autoplay: true,
    muted: true,
    loop: false,
  }

  // Используем тестовое видео в dev режиме если не настроено через админку
  const effectiveSettings = (process.env.NODE_ENV === 'development' && testVideoEnabled && !homepageSettings?.heroVideoUrl)
    ? testVideo
    : {
        enabled: homepageSettings?.heroVideoEnabled,
        title: homepageSettings?.heroVideoTitle,
        videoUrl: homepageSettings?.heroVideoUrl,
        posterUrl: homepageSettings?.heroPosterUrl,
        autoplay: homepageSettings?.heroVideoAutoplay,
        muted: homepageSettings?.heroVideoMuted,
        loop: homepageSettings?.heroVideoLoop,
      }

  return (
    <>
      {/* Hero Section - Первый экран */}
      <HeroSection />

      {/* Hero Video - Второй экран (полноэкранное видео, управляется из админки) */}
      {effectiveSettings.enabled && 
       effectiveSettings.videoUrl && 
       effectiveSettings.posterUrl && (
        <HeroVideoSection
          title={effectiveSettings.title}
          videoUrl={effectiveSettings.videoUrl}
          posterUrl={effectiveSettings.posterUrl}
          autoplay={effectiveSettings.autoplay ?? true}
          muted={effectiveSettings.muted ?? true}
          loop={effectiveSettings.loop ?? false}
        />
      )}

      {/* Dev notice если видео не настроено */}
      {process.env.NODE_ENV === 'development' && !homepageSettings?.heroVideoUrl && (
        <section className="snap-section min-h-screen flex items-center justify-center bg-yellow-50">
          <div className="text-center p-8">
            <h2 className="text-3xl font-bold text-yellow-800 mb-4">
              ⚠️ Hero Video Не Настроено
            </h2>
            <p className="text-lg text-yellow-700 mb-4">
              Откройте <a href="/admin" className="text-blue-600 underline">/admin</a> и настройте "Главная страница"
            </p>
            <ol className="text-left max-w-md mx-auto text-yellow-700 space-y-2">
              <li>1. Нажмите "🏠 Главная страница"</li>
              <li>2. Включите "🎬 Включить Hero Video"</li>
              <li>3. Добавьте URL видео из Cloudinary</li>
              <li>4. Нажмите "Publish"</li>
            </ol>
          </div>
        </section>
      )}

      {/* Problem/Solution Section - Третий экран */}
      <ProblemSolutionSection />

      {/* Video Formats Section - Какие ролики создаем */}
      <VideoFormatsSection />

      {/* Video Gallery Section - Галерея портфолио */}
      <VideoGallerySection />

      {/* Process Section - Процесс работы (7 шагов) */}
      <ProcessSection />

      {/* Pricing Section - Тарифы и стоимость */}
      <PricingSection />

      {/* Benefits Section - Преимущества */}
      <BenefitsSection />

      {/* FAQ Section - Часто задаваемые вопросы */}
      <FAQSection />

      {/* Contact Form Section - Финальный экран */}
      <ContactFormSection />
    </>
  )
}
