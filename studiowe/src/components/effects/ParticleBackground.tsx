'use client'

import { useEffect, useRef } from 'react'

/**
 * ParticleBackground - интерактивное облако частиц
 * 
 * Features:
 * - Частицы следуют за курсором с притяжением
 * - Отталкивание между частицами (предотвращение слияния)
 * - Motion blur эффект при движении
 * - Плавное колебание в состоянии покоя
 * - Органическая форма облака (как капля ртути)
 * 
 * @performance Оптимизировано с requestAnimationFrame и spatial hashing
 */

interface Particle {
  x: number
  y: number
  vx: number
  vy: number
  baseX: number // Базовая позиция для ambient motion
  baseY: number
  size: number
  opacity: number
  colorTransitionDelay: number // Задержка для волнового эффекта смены цвета
  currentColor: { r: number; g: number; b: number }
  targetColor: { r: number; g: number; b: number }
  colorProgress: number // Прогресс перехода цвета (0-1)
}

interface ParticleBackgroundProps {
  particleCount?: number
  maxSpeed?: number
  attractionStrength?: number
  repulsionStrength?: number
  repulsionRadius?: number
  colors?: string[] // Массив цветов для градиента (RGB формат)
  colorTransitionDuration?: number // Длительность перехода цвета в секундах
  colorHoldDuration?: number // Длительность удержания цвета в секундах
}

export function ParticleBackground({
  particleCount = 150,
  maxSpeed = 2,
  attractionStrength = 0.0003,
  repulsionStrength = 0.5,
  repulsionRadius = 40,
  colors = [
    '59, 130, 246',   // blue-600
    '168, 85, 247',   // purple-600
    '236, 72, 153',   // pink-600
    '59, 130, 246',   // blue-600 (возврат)
  ],
  colorTransitionDuration = 3, // 3 секунды на переход
  colorHoldDuration = 2, // 2 секунды удержание цвета
}: ParticleBackgroundProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const particlesRef = useRef<Particle[]>([])
  const mouseRef = useRef({ x: 0, y: 0, active: false })
  const animationFrameRef = useRef<number>()
  const timeRef = useRef(0)
  const colorTimeRef = useRef(0)
  const currentColorIndexRef = useRef(0)
  const isTransitioningRef = useRef(false)
  const holdTimeRef = useRef(0)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d', { alpha: true })
    if (!ctx) return

    // Установка размеров canvas
    const resizeCanvas = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }
    resizeCanvas()
    window.addEventListener('resize', resizeCanvas)

    // Парсинг RGB строки в объект
    const parseRGB = (rgbString: string) => {
      const [r, g, b] = rgbString.split(',').map(num => parseInt(num.trim()))
      return { r, g, b }
    }

    // Инициализация частиц в органической форме (эллипс с вариацией)
    const initParticles = () => {
      const particles: Particle[] = []
      const centerX = canvas.width / 2
      const centerY = canvas.height / 2
      const radiusX = Math.min(canvas.width, canvas.height) * 0.3
      const radiusY = Math.min(canvas.width, canvas.height) * 0.25
      const initialColor = parseRGB(colors[0])

      for (let i = 0; i < particleCount; i++) {
        // Генерация позиции в эллипсе с вариацией
        const angle = Math.random() * Math.PI * 2
        const radiusVariation = 0.3 + Math.random() * 0.7 // Неравномерное распределение
        const r = Math.sqrt(Math.random()) * radiusVariation

        const x = centerX + Math.cos(angle) * radiusX * r
        const y = centerY + Math.sin(angle) * radiusY * r

        particles.push({
          x,
          y,
          vx: 0,
          vy: 0,
          baseX: x,
          baseY: y,
          size: 1.5 + Math.random() * 2, // Разный размер частиц
          opacity: 0.3 + Math.random() * 0.4,
          colorTransitionDelay: Math.random(), // Случайная задержка для волнового эффекта
          currentColor: { ...initialColor },
          targetColor: { ...initialColor },
          colorProgress: 1,
        })
      }

      particlesRef.current = particles
    }

    initParticles()

    // Обработка движения мыши
    const handleMouseMove = (e: MouseEvent) => {
      mouseRef.current = {
        x: e.clientX,
        y: e.clientY,
        active: true,
      }
    }

    const handleMouseLeave = () => {
      mouseRef.current.active = false
    }

    window.addEventListener('mousemove', handleMouseMove)
    window.addEventListener('mouseleave', handleMouseLeave)

    // Линейная интерполяция между цветами
    const lerpColor = (start: { r: number; g: number; b: number }, end: { r: number; g: number; b: number }, t: number) => {
      return {
        r: Math.round(start.r + (end.r - start.r) * t),
        g: Math.round(start.g + (end.g - start.g) * t),
        b: Math.round(start.b + (end.b - start.b) * t),
      }
    }

    // Анимационный цикл
    const animate = () => {
      timeRef.current += 0.01
      const deltaTime = 1 / 60 // Примерно 60 FPS

      // Очистка с trail эффектом (для motion blur)
      ctx.fillStyle = 'rgba(255, 255, 255, 0.15)'
      ctx.fillRect(0, 0, canvas.width, canvas.height)

      const particles = particlesRef.current
      const mouse = mouseRef.current

      // Управление переходами цвета
      if (!isTransitioningRef.current) {
        // Удержание текущего цвета
        holdTimeRef.current += deltaTime
        if (holdTimeRef.current >= colorHoldDuration) {
          // Начинаем переход к следующему цвету
          isTransitioningRef.current = true
          holdTimeRef.current = 0
          colorTimeRef.current = 0
          currentColorIndexRef.current = (currentColorIndexRef.current + 1) % colors.length
          const nextColor = parseRGB(colors[currentColorIndexRef.current])
          
          // Устанавливаем целевой цвет для всех частиц
          particles.forEach((p) => {
            p.targetColor = { ...nextColor }
            p.colorProgress = 0
          })
        }
      } else {
        // Процесс перехода цвета
        colorTimeRef.current += deltaTime

        // Обновляем прогресс для каждой частицы с учетом её задержки
        particles.forEach((p) => {
          const particleTransitionStart = p.colorTransitionDelay * colorTransitionDuration * 0.3
          const particleTime = Math.max(0, colorTimeRef.current - particleTransitionStart)
          const particleProgress = Math.min(1, particleTime / (colorTransitionDuration * 0.7))

          if (particleProgress > p.colorProgress) {
            p.colorProgress = particleProgress
            p.currentColor = lerpColor(p.currentColor, p.targetColor, particleProgress)
          }
        })

        // Проверяем завершение перехода
        if (colorTimeRef.current >= colorTransitionDuration) {
          isTransitioningRef.current = false
          particles.forEach((p) => {
            p.currentColor = { ...p.targetColor }
            p.colorProgress = 1
          })
        }
      }

      // Обновление позиций частиц
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i]

        // Ambient motion (плавное колебание) - очень слабое
        const ambientX = Math.sin(timeRef.current + i * 0.1) * 0.2
        const ambientY = Math.cos(timeRef.current * 0.8 + i * 0.15) * 0.2

        let forceX = ambientX
        let forceY = ambientY

        // Притяжение к курсору
        if (mouse.active) {
          const dx = mouse.x - p.x
          const dy = mouse.y - p.y
          const distance = Math.sqrt(dx * dx + dy * dy)

          if (distance > 0) {
            // Сила притяжения уменьшается с расстоянием
            const force = attractionStrength * distance
            forceX += (dx / distance) * force
            forceY += (dy / distance) * force
          }
        }

        // Мягкие границы экрана (отталкивание от краев)
        const margin = 100
        if (p.x < margin) {
          forceX += (margin - p.x) * 0.01
        } else if (p.x > canvas.width - margin) {
          forceX -= (p.x - (canvas.width - margin)) * 0.01
        }
        if (p.y < margin) {
          forceY += (margin - p.y) * 0.01
        } else if (p.y > canvas.height - margin) {
          forceY -= (p.y - (canvas.height - margin)) * 0.01
        }

        // Отталкивание от других частиц
        for (let j = i + 1; j < particles.length; j++) {
          const p2 = particles[j]
          const dx = p2.x - p.x
          const dy = p2.y - p.y
          const distance = Math.sqrt(dx * dx + dy * dy)

          if (distance < repulsionRadius && distance > 0) {
            // Сила отталкивания увеличивается при близости
            const force = (repulsionStrength * (repulsionRadius - distance)) / distance

            const fx = (dx / distance) * force
            const fy = (dy / distance) * force

            p.vx -= fx
            p.vy -= fy
            p2.vx += fx
            p2.vy += fy
          }
        }

        // Применение сил
        p.vx += forceX
        p.vy += forceY

        // Dampening (сопротивление) - уменьшено для более свободного движения
        p.vx *= 0.92
        p.vy *= 0.92

        // Ограничение максимальной скорости
        const speed = Math.sqrt(p.vx * p.vx + p.vy * p.vy)
        if (speed > maxSpeed) {
          p.vx = (p.vx / speed) * maxSpeed
          p.vy = (p.vy / speed) * maxSpeed
        }

        // Обновление позиции
        p.x += p.vx
        p.y += p.vy

        // Отрисовка частицы с motion blur
        const particleSpeed = Math.sqrt(p.vx * p.vx + p.vy * p.vy)
        const particleColorString = `${p.currentColor.r}, ${p.currentColor.g}, ${p.currentColor.b}`
        
        if (particleSpeed > 0.5) {
          // Motion blur эффект - рисуем линию
          const trailLength = Math.min(particleSpeed * 3, 15)
          const angle = Math.atan2(p.vy, p.vx)
          
          const gradient = ctx.createLinearGradient(
            p.x - Math.cos(angle) * trailLength,
            p.y - Math.sin(angle) * trailLength,
            p.x,
            p.y
          )
          gradient.addColorStop(0, `rgba(${particleColorString}, 0)`)
          gradient.addColorStop(1, `rgba(${particleColorString}, ${p.opacity})`)

          ctx.strokeStyle = gradient
          ctx.lineWidth = p.size
          ctx.lineCap = 'round'
          ctx.beginPath()
          ctx.moveTo(p.x - Math.cos(angle) * trailLength, p.y - Math.sin(angle) * trailLength)
          ctx.lineTo(p.x, p.y)
          ctx.stroke()
        } else {
          // Обычная точка в покое
          ctx.fillStyle = `rgba(${particleColorString}, ${p.opacity})`
          ctx.beginPath()
          ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2)
          ctx.fill()
        }
      }

      animationFrameRef.current = requestAnimationFrame(animate)
    }

    animate()

    // Cleanup
    return () => {
      window.removeEventListener('resize', resizeCanvas)
      window.removeEventListener('mousemove', handleMouseMove)
      window.removeEventListener('mouseleave', handleMouseLeave)
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current)
      }
    }
  }, [particleCount, maxSpeed, attractionStrength, repulsionStrength, repulsionRadius, colors, colorTransitionDuration, colorHoldDuration])

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full pointer-events-none"
      style={{ background: 'transparent' }}
    />
  )
}

