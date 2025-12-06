import { HeroSection } from '@/components/sections/HeroSection'
import { ProblemSolutionSection } from '@/components/sections/ProblemSolutionSection'
import { VideoFormatsSection } from '@/components/sections/VideoFormatsSection'
import { VideoGallerySection } from '@/components/sections/VideoGallerySection'
import { ProcessSection } from '@/components/sections/ProcessSection'
import { PricingSection } from '@/components/sections/PricingSection'
import { BenefitsSection } from '@/components/sections/BenefitsSection'
import { FAQSection } from '@/components/sections/FAQSection'
import { ContactFormSection } from '@/components/sections/ContactFormSection'

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

export default function HomePage() {
  return (
    <main className="min-h-screen">
      {/* Hero Section - Первый экран */}
      <HeroSection />

      {/* Problem/Solution Section - Второй экран */}
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
    </main>
  )
}
