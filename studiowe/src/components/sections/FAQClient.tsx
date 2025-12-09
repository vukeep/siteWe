/**
 * FAQ Client Component
 * 
 * Клиентская часть FAQ с интерактивным аккордеоном
 */

'use client'

import { useState } from 'react'
import type { FAQItem } from '@/lib/sanity/queries'

interface FAQClientProps {
  items: FAQItem[]
  title: string
  subtitle: string
  ctaText: string
  ctaButtonText: string
}

export function FAQClient({ items, title, subtitle, ctaText, ctaButtonText }: FAQClientProps) {
  const [openId, setOpenId] = useState<string | null>(null)

  const toggleItem = (id: string) => {
    setOpenId(openId === id ? null : id)
  }

  return (
    <section id="faq" className="snap-section py-20 lg:py-32 bg-background">
      <div className="container-custom">
        {/* Заголовок секции */}
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-4 text-heading">
            {title}
          </h2>
          <p className="text-lg md:text-xl text-neutral-600 max-w-3xl mx-auto">
            {subtitle}
          </p>
        </div>

        {/* Аккордеон */}
        <div className="max-w-4xl mx-auto space-y-4">
          {items.map((item) => {
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
                  <span className="text-lg md:text-xl font-bold text-heading pr-4">
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
                    <p className="text-neutral-700 leading-relaxed text-base md:text-lg whitespace-pre-line">
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
            {ctaText}
          </p>
          <a
            href="#contacts"
            className="inline-block px-8 py-4 bg-button hover:bg-button-hover text-white rounded-lg font-semibold text-lg transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105 active:scale-95"
          >
            {ctaButtonText}
          </a>
        </div>
      </div>
    </section>
  )
}

