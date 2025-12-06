import { LeadForm } from '@/components/forms/LeadForm'

/**
 * Contact Form Section - Седьмой экран (финальный)
 * 
 * Включает:
 * - Описание Studio:We
 * - Крупный заголовок призыва к действию
 * - Форма заявки с валидацией
 * 
 * Адаптивная верстка с акцентом на форму
 */

export function ContactFormSection() {
  return (
    <section id="contacts" className="py-20 lg:py-32 bg-neutral-900 text-white">
      <div className="container-custom">
        <div className="max-w-4xl mx-auto">
          {/* Описание студии */}
          <div className="text-center mb-12">
            <p className="text-lg md:text-xl text-neutral-300 mb-8">
              Studio :We — студия нового поколения, создающая масштабный видеоконтент с применением генеративного ИИ.
            </p>
            <p className="text-base md:text-lg text-neutral-400 max-w-3xl mx-auto">
              Мы помогаем бизнесу быстро, юридически безопасно и в едином стиле производить десятки и сотни роликов
              для digital-маркетинга, обучения и бренд-коммуникаций.
            </p>
          </div>

          {/* Крупный заголовок */}
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-4">
              Готовы начать?<br />
              <span className="text-gradient">Свяжитесь с нами</span>
            </h2>
          </div>

          {/* Форма заявки */}
          <div className="bg-white rounded-2xl p-6 md:p-10 card-shadow-lg">
            <h3 className="text-2xl md:text-3xl font-bold text-neutral-900 mb-6 text-center">
              Форма заявки
            </h3>
            <LeadForm requestType="general" />
          </div>

          {/* Дополнительная информация */}
          <div className="mt-12 text-center">
            <p className="text-neutral-400 text-sm md:text-base">
              Или свяжитесь с нами напрямую:
            </p>
            <div className="mt-4 flex flex-col sm:flex-row justify-center gap-4 sm:gap-8">
              <a
                href="mailto:hello@studiowe.com"
                className="text-blue-400 hover:text-blue-300 transition-colors"
              >
                hello@studiowe.com
              </a>
              <a
                href="tel:+79001234567"
                className="text-blue-400 hover:text-blue-300 transition-colors"
              >
                +7 (900) 123-45-67
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

