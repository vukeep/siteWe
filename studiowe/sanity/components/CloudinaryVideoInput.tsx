/**
 * Custom Sanity Input: Cloudinary Video with Auto-transformations
 * 
 * Умный компонент для работы с Cloudinary видео:
 * - Ввод базового URL
 * - Автоматическая генерация трансформированных версий
 * - Превью результатов
 * - Автоматическое заполнение связанных полей
 */

import { StringInputProps, set, unset, useFormValue, useDocumentOperation } from 'sanity'
import { Stack, Text, TextInput, Card, Box, Flex, Badge, Button } from '@sanity/ui'
import { useCallback, useEffect, useState } from 'react'
import { getOptimizedVideoUrl, getVideoPosterUrl, isValidCloudinaryUrl } from '../lib/cloudinary-helpers'

export function CloudinaryVideoInput(props: StringInputProps) {
  const { value, onChange, elementProps, path } = props
  
  // Получаем доступ к документу и операциям
  const document = useFormValue([]) as any
  const { patch } = useDocumentOperation(document?._id, document?._type)
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

  // Автоматическое заполнение связанных полей
  const fillVideoUrl = useCallback(() => {
    if (optimizedUrl && patch) {
      patch.execute([{ set: { heroVideoUrl: optimizedUrl } }])
      console.log('✅ Автоматически заполнено heroVideoUrl:', optimizedUrl)
    }
  }, [optimizedUrl, patch])

  const fillPosterUrl = useCallback(() => {
    if (posterUrl && patch) {
      patch.execute([{ set: { heroPosterUrl: posterUrl } }])
      console.log('✅ Автоматически заполнено heroPosterUrl:', posterUrl)
    }
  }, [posterUrl, patch])

  return (
    <Stack space={3}>
      {/* Основное поле ввода */}
      <TextInput
        {...elementProps}
        value={localValue}
        onChange={handleChange}
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
              <Flex align="center" justify="space-between" style={{ marginBottom: '8px' }}>
                <Text size={1} weight="semibold">
                  🎬 Оптимизированное видео:
                </Text>
                <Button
                  mode="default"
                  tone="positive"
                  text="Заполнить ↓"
                  fontSize={1}
                  padding={2}
                  onClick={fillVideoUrl}
                />
              </Flex>
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
              <Flex align="center" justify="space-between" style={{ marginBottom: '8px' }}>
                <Text size={1} weight="semibold">
                  🖼️ Постер (первый кадр):
                </Text>
                <Button
                  mode="default"
                  tone="positive"
                  text="Заполнить ↓"
                  fontSize={1}
                  padding={2}
                  onClick={fillPosterUrl}
                />
              </Flex>
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
                💡 Нажмите <strong>"Заполнить ↓"</strong> чтобы автоматически заполнить поля ниже
              </Text>
            </Card>
          </Stack>
        </Card>
      )}
    </Stack>
  )
}

