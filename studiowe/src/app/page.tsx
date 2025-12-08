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
      {/* Hero Section - Первый экран */}
      <HeroSection />

      {/* Hero Video - Второй экран (полноэкранное видео, управляется из админки) */}
      {homepageSettings?.heroVideoEnabled && 
       homepageSettings?.heroVideoUrl && 
       homepageSettings?.heroPosterUrl ? (
        <HeroVideoSection
          title={homepageSettings.heroVideoTitle || undefined}
          videoUrl={homepageSettings.heroVideoUrl}
          posterUrl={homepageSettings.heroPosterUrl}
          autoplay={homepageSettings.heroVideoAutoplay ?? true}
          muted={homepageSettings.heroVideoMuted ?? true}
          loop={homepageSettings.heroVideoLoop ?? false}
        />
      ) : process.env.NODE_ENV === 'development' ? (
        // Dev notice если видео не настроено
        <section className="snap-section min-h-screen flex items-center justify-center bg-background">
          <div className="text-center p-8">
            <h2 className="text-3xl font-bold text-yellow-800 mb-4">
              ⚠️ Hero Video Не Настроено
            </h2>
            <p className="text-lg text-yellow-700 mb-4">
              Откройте <a href="/admin" className="text-blue-600 underline">/admin</a> и настройте "Главная страница"
            </p>
          </div>
        </section>
      ) : null}

      {/* Problem/Solution Section - Третий экран */}
      <ProblemSolutionSection 
        slides={problemSolutionSlides}
        // Заголовок можно оставить хардкодным или вынести в настройки, 
        // но сейчас он не приходит из Sanity по вашему запросу
        sectionTitle="Видеопродакшн без головной боли"
      />

      {/* Video Formats Section - Какие ролики создаем (Торговые ниши) */}
      <VideoFormatsSection niches={tradingNiches} />

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
