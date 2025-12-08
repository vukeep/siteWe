'use client'

import { useState } from 'react'

/**
 * FAQ Section - Часто задаваемые вопросы
 * 
 * Согласно Structure.md:
 * 1. Будут ли ролики в едином стиле?
 * 2. Можно ли использовать видео в рекламе?
 * 3. Как согласовываем ролики?
 * 4. Можно ли адаптировать под бренд?
 * 5. Есть ли ограничения по объему?
 * 
 * Реализовано как аккордеон с анимацией
 */

interface FAQItem {
  id: string
  question: string
  answer: string
}

const faqItems: FAQItem[] = [
  {
    id: 'style',
    question: 'Будут ли ролики в едином стиле?',
    answer: 'Да, обязательно. Мы создаем единый визуальный язык на этапе мудборда и концепции, фиксируем промпты и параметры нейросетей. Это позволяет генерировать десятки роликов, которые выглядят как части одной кампании — с узнаваемыми персонажами, цветовой палитрой и общей эстетикой.',
  },
  {
    id: 'ads',
    question: 'Можно ли использовать ваши видео в рекламе?',
    answer: 'Да, все образы созданы нейросетями и юридически проверяются на соответствие правилам использования. Вы получаете полные права на использование роликов в коммерческих целях, включая таргетированную рекламу, соцсети, сайты и любые digital-каналы.',
  },
  {
    id: 'approval',
    question: 'Как мы согласовываем ролики?',
    answer: 'Согласование проходит посредством электронной почты. Мы отправляем промежуточные версии на ключевых этапах (мудборд, первые тесты, финальные ролики), вы даете обратную связь, мы вносим правки. В будущем планируем гостевые доступы в таск-трекер для более удобного процесса.',
  },
  {
    id: 'branding',
    question: 'Можно ли адаптировать под бренд?',
    answer: 'Да, полностью. Мы интегрируем ваш фирменный стиль: цвета, шрифты, логотип, tone of voice. На этапе брифа изучаем брендбук, на этапе мудборда согласуем визуальное направление. Результат — ролики, которые органично вписываются в вашу коммуникацию.',
  },
  {
    id: 'limits',
    question: 'Есть ли ограничения по объему?',
    answer: 'Нет жестких ограничений. Мы работали с заказами от 1 до 100+ роликов. Чем больше объем, тем эффективнее стоимость за единицу контента. Для масштабных серий (50+ роликов) согласовываем поэтапную отгрузку и индивидуальные условия.',
  },
]

export function FAQSection({ title = "Частые вопросы" }: { title?: string }) {
  const [openId, setOpenId] = useState<string | null>(null)

  const toggleItem = (id: string) => {
    setOpenId(openId === id ? null : id)
  }

  return (
    <section id="faq" className="snap-section py-20 lg:py-32 bg-background">
      <div className="container-custom">
        {/* Заголовок секции */}
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-4 text-neutral-900">
            {title}
          </h2>
          <p className="text-lg md:text-xl text-neutral-600 max-w-3xl mx-auto">
            Ответы на популярные вопросы о работе с AI-видеопродакшном
          </p>
        </div>

        {/* Аккордеон */}
        <div className="max-w-4xl mx-auto space-y-4">
          {faqItems.map((item) => {
            const isOpen = openId === item.id

            return (
              <div
                key={item.id}
                className="bg-white rounded-2xl border-2 border-neutral-200 overflow-hidden transition-all duration-300 hover:border-blue-300"
              >
                {/* Вопрос */}
                <button
                  onClick={() => toggleItem(item.id)}
                  className="w-full flex items-center justify-between p-6 md:p-8 text-left transition-colors hover:bg-neutral-50"
                >
                  <span className="text-lg md:text-xl font-bold text-neutral-900 pr-4">
                    {item.question}
                  </span>
                  <span
                    className={`flex-shrink-0 w-8 h-8 flex items-center justify-center rounded-full bg-blue-100 text-blue-600 transition-transform duration-300 ${
                      isOpen ? 'rotate-180' : ''
                    }`}
                  >
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 9l-7 7-7-7"
                      />
                    </svg>
                  </span>
                </button>

                {/* Ответ */}
                <div
                  className={`transition-all duration-300 ease-in-out ${
                    isOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
                  }`}
                  style={{ overflow: 'hidden' }}
                >
                  <div className="px-6 md:px-8 pb-6 md:pb-8">
                    <p className="text-neutral-700 leading-relaxed text-base md:text-lg">
                      {item.answer}
                    </p>
                  </div>
                </div>
              </div>
            )
          })}
        </div>

        {/* CTA */}
        <div className="text-center mt-12">
          <p className="text-neutral-600 mb-6">
            Не нашли ответ на свой вопрос?
          </p>
          <a
            href="#contacts"
            className="inline-block px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold text-lg transition-all duration-300 shadow-lg hover:shadow-xl"
          >
            Задать вопрос
          </a>
        </div>
      </div>
    </section>
  )
}

