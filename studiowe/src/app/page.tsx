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

  return (
    <>
      {/* Hero Section - Первый экран */}
      <HeroSection />

      {/* Hero Video - Второй экран (полноэкранное видео, управляется из админки) */}
      {homepageSettings?.heroVideoEnabled && 
       homepageSettings.heroVideoUrl && 
       homepageSettings.heroPosterUrl && (
        <HeroVideoSection
          title={homepageSettings.heroVideoTitle}
          videoUrl={homepageSettings.heroVideoUrl}
          posterUrl={homepageSettings.heroPosterUrl}
          autoplay={homepageSettings.heroVideoAutoplay}
          muted={homepageSettings.heroVideoMuted}
          loop={homepageSettings.heroVideoLoop}
        />
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
