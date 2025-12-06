'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { leadFormSchema, type LeadFormData } from '@/lib/validations/lead-form'
import { cn } from '@/lib/utils'

/**
 * Компонент формы заявки
 * 
 * Используется в нескольких местах:
 * - Контактная форма на главной странице (седьмой экран)
 * - Модальное окно "Хочу также" в галерее
 * - Модальное окно "Получить расчет" в секции тарифов
 * 
 * Features:
 * - Валидация через React Hook Form + Zod
 * - Обработка состояний (idle, submitting, success, error)
 * - Honeypot защита от ботов
 * - Доступность (ARIA attributes)
 * - Адаптивная верстка
 */

interface LeadFormProps {
  /** Тип заявки для аналитики */
  requestType?: 'general' | 'portfolio_request' | 'pricing_calculation'
  /** Показывать ли поле "Количество роликов" */
  showVideoCount?: boolean
  /** CSS классы для контейнера */
  className?: string
  /** Callback при успешной отправке */
  onSuccess?: () => void
}

export function LeadForm({
  requestType = 'general',
  showVideoCount = false,
  className,
  onSuccess,
}: LeadFormProps) {
  const [submitState, setSubmitState] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle')
  const [errorMessage, setErrorMessage] = useState('')

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    resolver: zodResolver(leadFormSchema),
    defaultValues: {
      requestType,
    },
  })

  const onSubmit = async (data: any) => {
    setSubmitState('submitting')
    setErrorMessage('')

    try {
      const response = await fetch('/api/lead', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      })

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.message || 'Ошибка при отправке формы')
      }

      setSubmitState('success')
      reset()
      
      if (onSuccess) {
        onSuccess()
      }

      // Сброс состояния success через 5 секунд
      setTimeout(() => {
        setSubmitState('idle')
      }, 5000)
    } catch (error) {
      console.error('Ошибка отправки формы:', error)
      setSubmitState('error')
      setErrorMessage(
        error instanceof Error ? error.message : 'Произошла ошибка. Попробуйте позже.'
      )
    }
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className={cn('space-y-6', className)}
      noValidate
    >
      {/* Honeypot поле (скрыто от пользователей) */}
      <input
        type="text"
        {...register('_hp')}
        className="sr-only"
        tabIndex={-1}
        autoComplete="off"
      />

      {/* Имя */}
      <div>
        <label htmlFor="name" className="block text-sm font-medium text-neutral-700 mb-2">
          Имя <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          id="name"
          {...register('name')}
          className={cn(
            'w-full px-4 py-3 border rounded-lg transition-colors',
            'focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent',
            errors.name
              ? 'border-red-500 bg-red-50'
              : 'border-neutral-300 bg-white hover:border-neutral-400'
          )}
          placeholder="Ваше имя"
          disabled={submitState === 'submitting'}
          aria-invalid={errors.name ? 'true' : 'false'}
          aria-describedby={errors.name ? 'name-error' : undefined}
        />
        {errors.name && (
          <p id="name-error" className="mt-1 text-sm text-red-600">
            {errors.name.message}
          </p>
        )}
      </div>

      {/* Компания */}
      <div>
        <label htmlFor="company" className="block text-sm font-medium text-neutral-700 mb-2">
          Компания <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          id="company"
          {...register('company')}
          className={cn(
            'w-full px-4 py-3 border rounded-lg transition-colors',
            'focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent',
            errors.company
              ? 'border-red-500 bg-red-50'
              : 'border-neutral-300 bg-white hover:border-neutral-400'
          )}
          placeholder="Название компании"
          disabled={submitState === 'submitting'}
          aria-invalid={errors.company ? 'true' : 'false'}
          aria-describedby={errors.company ? 'company-error' : undefined}
        />
        {errors.company && (
          <p id="company-error" className="mt-1 text-sm text-red-600">
            {errors.company.message}
          </p>
        )}
      </div>

      {/* Телефон */}
      <div>
        <label htmlFor="phone" className="block text-sm font-medium text-neutral-700 mb-2">
          Телефон <span className="text-red-500">*</span>
        </label>
        <input
          type="tel"
          id="phone"
          {...register('phone')}
          className={cn(
            'w-full px-4 py-3 border rounded-lg transition-colors',
            'focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent',
            errors.phone
              ? 'border-red-500 bg-red-50'
              : 'border-neutral-300 bg-white hover:border-neutral-400'
          )}
          placeholder="+7 (___) ___-__-__"
          disabled={submitState === 'submitting'}
          aria-invalid={errors.phone ? 'true' : 'false'}
          aria-describedby={errors.phone ? 'phone-error' : undefined}
        />
        {errors.phone && (
          <p id="phone-error" className="mt-1 text-sm text-red-600">
            {errors.phone.message}
          </p>
        )}
      </div>

      {/* Email */}
      <div>
        <label htmlFor="email" className="block text-sm font-medium text-neutral-700 mb-2">
          Email <span className="text-red-500">*</span>
        </label>
        <input
          type="email"
          id="email"
          {...register('email')}
          className={cn(
            'w-full px-4 py-3 border rounded-lg transition-colors',
            'focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent',
            errors.email
              ? 'border-red-500 bg-red-50'
              : 'border-neutral-300 bg-white hover:border-neutral-400'
          )}
          placeholder="email@example.com"
          disabled={submitState === 'submitting'}
          aria-invalid={errors.email ? 'true' : 'false'}
          aria-describedby={errors.email ? 'email-error' : undefined}
        />
        {errors.email && (
          <p id="email-error" className="mt-1 text-sm text-red-600">
            {errors.email.message}
          </p>
        )}
      </div>

      {/* Задача */}
      <div>
        <label htmlFor="task" className="block text-sm font-medium text-neutral-700 mb-2">
          Задача/формат роликов <span className="text-red-500">*</span>
        </label>
        <textarea
          id="task"
          {...register('task')}
          rows={4}
          className={cn(
            'w-full px-4 py-3 border rounded-lg transition-colors resize-none',
            'focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent',
            errors.task
              ? 'border-red-500 bg-red-50'
              : 'border-neutral-300 bg-white hover:border-neutral-400'
          )}
          placeholder="Опишите вашу задачу: какие ролики нужны, для каких целей, примерный объем..."
          disabled={submitState === 'submitting'}
          aria-invalid={errors.task ? 'true' : 'false'}
          aria-describedby={errors.task ? 'task-error' : undefined}
        />
        {errors.task && (
          <p id="task-error" className="mt-1 text-sm text-red-600">
            {errors.task.message}
          </p>
        )}
      </div>

      {/* Количество роликов (опционально) */}
      {showVideoCount && (
        <div>
          <label htmlFor="videoCount" className="block text-sm font-medium text-neutral-700 mb-2">
            Примерное количество роликов
          </label>
          <select
            id="videoCount"
            {...register('videoCount')}
            className={cn(
              'w-full px-4 py-3 border rounded-lg transition-colors',
              'focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent',
              'border-neutral-300 bg-white hover:border-neutral-400'
            )}
            disabled={submitState === 'submitting'}
          >
            <option value="">Выберите диапазон</option>
            <option value="1-5">1-5 роликов</option>
            <option value="6-10">6-10 роликов</option>
            <option value="11-20">11-20 роликов</option>
            <option value="21-50">21-50 роликов</option>
            <option value="50+">50+ роликов</option>
          </select>
        </div>
      )}

      {/* Сообщения об ошибке или успехе */}
      {submitState === 'error' && (
        <div
          className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-700"
          role="alert"
        >
          {errorMessage}
        </div>
      )}

      {submitState === 'success' && (
        <div
          className="p-4 bg-green-50 border border-green-200 rounded-lg text-green-700"
          role="status"
        >
          ✓ Спасибо! Ваша заявка принята. Мы свяжемся с вами в ближайшее время.
        </div>
      )}

      {/* Кнопка отправки */}
      <button
        type="submit"
        disabled={submitState === 'submitting' || submitState === 'success'}
        className={cn(
          'w-full px-6 py-4 rounded-lg font-semibold text-lg transition-all',
          'focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2',
          submitState === 'submitting' || submitState === 'success'
            ? 'bg-neutral-300 text-neutral-500 cursor-not-allowed'
            : 'bg-blue-600 hover:bg-blue-700 text-white shadow-lg hover:shadow-xl'
        )}
      >
        {submitState === 'submitting' && 'Отправка...'}
        {submitState === 'success' && 'Отправлено ✓'}
        {(submitState === 'idle' || submitState === 'error') && 'Получить консультацию'}
      </button>

      {/* Примечание о конфиденциальности */}
      <p className="text-sm text-neutral-500 text-center">
        Нажимая кнопку, вы соглашаетесь с{' '}
        <a href="#" className="text-blue-600 hover:underline">
          политикой конфиденциальности
        </a>
      </p>
    </form>
  )
}

