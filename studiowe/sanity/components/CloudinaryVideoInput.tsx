/**
 * Custom Sanity Input: Cloudinary Video with Auto-transformations
 * 
 * Умный компонент для работы с Cloudinary видео:
 * - Ввод базового URL
 * - Автоматическая генерация трансформированных версий
 * - Превью результатов
 * - Возможность ручного редактирования
 */

import { StringInputProps, set, unset, useFormValue, PatchEvent } from 'sanity'
import { Stack, Text, TextInput, Card, Box, Flex, Badge } from '@sanity/ui'
import { useCallback, useEffect, useState } from 'react'
import { getOptimizedVideoUrl, getVideoPosterUrl, isValidCloudinaryUrl } from '../lib/cloudinary-helpers'

export function CloudinaryVideoInput(props: StringInputProps) {
  const { value, onChange, elementProps, path } = props
  
  // Получаем доступ ко всему документу
  const document = useFormValue([]) as any
  const [localValue, setLocalValue] = useState(value || '')
  const [isValid, setIsValid] = useState(true)
  const [optimizedUrl, setOptimizedUrl] = useState('')
  const [posterUrl, setPosterUrl] = useState('')

  // Обновление локального значения
  useEffect(() => {
    setLocalValue(value || '')
    
    if (value) {
      const valid = isValidCloudinaryUrl(value)
      setIsValid(valid)
      
      if (valid) {
        // Генерируем трансформированные URL
        const opt = getOptimizedVideoUrl(value)
        const post = getVideoPosterUrl(value)
        
        setOptimizedUrl(opt)
        setPosterUrl(post)
        
        // Автоматически обновляем связанные поля через родительский документ
        // Это будет работать через onBlur для избежания слишком частых обновлений
      }
    } else {
      setOptimizedUrl('')
      setPosterUrl('')
    }
  }, [value])

  // Обработчик изменения
  const handleChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = event.target.value
    setLocalValue(newValue)
    
    // Обновляем Sanity
    onChange(newValue ? set(newValue) : unset())
  }, [onChange])

  // Обработчик потери фокуса - обновляем связанные поля
  const handleBlur = useCallback(() => {
    if (localValue && isValid && optimizedUrl && posterUrl) {
      // Проверяем, изменились ли значения
      const currentVideoUrl = document?.videoUrl
      const currentPosterUrl = document?.posterUrl
      
      const shouldUpdateVideo = currentVideoUrl !== optimizedUrl
      const shouldUpdatePoster = currentPosterUrl !== posterUrl
      
      if (shouldUpdateVideo || shouldUpdatePoster) {
        // Создаем patch для обновления связанных полей
        // Это работает через form context Sanity
        const patches: any[] = []
        
        if (shouldUpdateVideo) {
          patches.push(
            PatchEvent.from(
              set(optimizedUrl, ['videoUrl'])
            )
          )
        }
        
        if (shouldUpdatePoster) {
          patches.push(
            PatchEvent.from(
              set(posterUrl, ['posterUrl'])
            )
          )
        }
        
        // Применяем патчи через небольшую задержку для корректной работы формы
        if (patches.length > 0) {
          setTimeout(() => {
            patches.forEach(patch => {
              // Триггерим обновление через onChange родительской формы
              onChange(patch)
            })
            
            console.log('✅ Auto-updated:', {
              videoUrl: shouldUpdateVideo ? optimizedUrl : 'unchanged',
              posterUrl: shouldUpdatePoster ? posterUrl : 'unchanged'
            })
          }, 100)
        }
      }
    }
  }, [localValue, isValid, optimizedUrl, posterUrl, document, onChange])

  return (
    <Stack space={3}>
      {/* Основное поле ввода */}
      <TextInput
        {...elementProps}
        value={localValue}
        onChange={handleChange}
        onBlur={handleBlur}
        placeholder="https://res.cloudinary.com/avitophoto/video/upload/v1765009796/studiowe/video.mp4"
      />

      {/* Валидация */}
      {localValue && !isValid && (
        <Card tone="critical" padding={3} radius={2}>
          <Text size={1}>
            ⚠️ URL должен быть из Cloudinary и содержать /upload/
          </Text>
        </Card>
      )}

      {/* Превью трансформаций */}
      {localValue && isValid && (
        <Card tone="positive" padding={3} radius={2} border>
          <Stack space={3}>
            <Flex align="center" gap={2}>
              <Badge tone="positive">✨ Автоматические трансформации</Badge>
            </Flex>

            {/* Оптимизированное видео */}
            <Box>
              <Text size={1} weight="semibold" style={{ marginBottom: '4px', display: 'block' }}>
                🎬 Оптимизированное видео:
              </Text>
              <Card tone="transparent" padding={2} radius={1} style={{ background: '#f6f6f6' }}>
                <Text size={1} style={{ wordBreak: 'break-all', fontFamily: 'monospace', fontSize: '11px' }}>
                  {optimizedUrl}
                </Text>
              </Card>
              <Text muted size={1} style={{ marginTop: '4px', display: 'block' }}>
                Трансформации: f_auto,q_auto
              </Text>
            </Box>

            {/* Постер */}
            <Box>
              <Text size={1} weight="semibold" style={{ marginBottom: '4px', display: 'block' }}>
                🖼️ Постер (первый кадр):
              </Text>
              <Card tone="transparent" padding={2} radius={1} style={{ background: '#f6f6f6' }}>
                <Text size={1} style={{ wordBreak: 'break-all', fontFamily: 'monospace', fontSize: '11px' }}>
                  {posterUrl}
                </Text>
              </Card>
              <Text muted size={1} style={{ marginTop: '4px', display: 'block' }}>
                Трансформации: so_0,f_webp,q_auto + .webp
              </Text>
            </Box>

            {/* Инфо */}
            <Card tone="primary" padding={2} radius={1}>
              <Text size={1}>
                💡 Поля <strong>videoUrl</strong> и <strong>posterUrl</strong> обновятся автоматически при сохранении
              </Text>
            </Card>
          </Stack>
        </Card>
      )}
    </Stack>
  )
}

