import { HeroSection } from '@/components/sections/HeroSection'
import { ProblemSolutionSection } from '@/components/sections/ProblemSolutionSection'
import { VideoFormatsSection } from '@/components/sections/VideoFormatsSection'
import { VideoGallerySection } from '@/components/sections/VideoGallerySection'
import { ProcessSection } from '@/components/sections/ProcessSection'
import { PricingSection } from '@/components/sections/PricingSection'
import { BenefitsSection } from '@/components/sections/BenefitsSection'
import { FAQSection } from '@/components/sections/FAQSection'
import { ContactFormSection } from '@/components/sections/ContactFormSection'
import { 
  getHomepageSettings, 
  getTradingNiches, 
  getProblemSolutionSlides,
  type HomepageSettings,
  type TradingNiche,
  type ProblemSolutionSlide
} from '@/lib/sanity/queries'

/**
 * Главная страница StudioWe
 * 
 * Все 7 экранов сайта (обновленный порядок):
 * 1. Hero с видео фоном (первый экран) ✅
 * 2. Проблема/Решение ✅
 * 3. Галерея портфолио (все работы из админки) ✅
 * 4. Форматы роликов (торговые ниши) ✅
 * 5. Процесс работы (7 шагов) ✅
 * 6. Тарифы (3 пакета) ✅
 * 7. Преимущества, FAQ и контактная форма ✅
 */

export default async function HomePage() {
  // Получаем данные из Sanity
  let homepageSettings: HomepageSettings | null = null
  let tradingNiches: TradingNiche[] = []
  let problemSolutionSlides: ProblemSolutionSlide[] = []

  try {
    homepageSettings = await getHomepageSettings()
  } catch (error) {
    console.error('❌ Error loading homepage settings:', error)
  }

  try {
    tradingNiches = await getTradingNiches()
  } catch (error) {
    console.error('❌ Error loading trading niches:', error)
  }

  try {
    problemSolutionSlides = await getProblemSolutionSlides()
  } catch (error) {
    console.error('❌ Error loading problem/solution slides:', error)
  }

  // Debug: показываем статус в dev режиме
  if (process.env.NODE_ENV === 'development') {
    console.log('📊 Homepage Settings:', {
      exists: !!homepageSettings,
      enabled: homepageSettings?.heroVideoEnabled,
      hasVideoUrl: !!homepageSettings?.heroVideoUrl,
      slidesCount: problemSolutionSlides?.length
    })
  }

  return (
    <>
      {/* Hero Section - Первый экран с видео фоном */}
      <HeroSection 
        videoUrl={homepageSettings?.heroVideoUrl}
        posterUrl={homepageSettings?.heroPosterUrl}
        videoAutoplay={homepageSettings?.heroVideoAutoplay ?? true}
        videoMuted={homepageSettings?.heroVideoMuted ?? true}
        videoLoop={homepageSettings?.heroVideoLoop ?? true}
      />

      {/* Problem/Solution Section - Второй экран */}
      <ProblemSolutionSection 
        slides={problemSolutionSlides}
        // Заголовок можно оставить хардкодным или вынести в настройки, 
        // но сейчас он не приходит из Sanity по вашему запросу
        sectionTitle="Видеопродакшн без головной боли"
      />

      {/* Video Gallery Section - Галерея портфолио (Третий экран) */}
      <VideoGallerySection />

      {/* Video Formats Section - Какие ролики создаем (Торговые ниши) */}
      <VideoFormatsSection niches={tradingNiches} />

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
