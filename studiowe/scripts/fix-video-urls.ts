// Загрузка environment variables
import { config } from 'dotenv'
import { resolve } from 'path'

const envPath = resolve(__dirname, '../.env.local')
config({ path: envPath })

async function fixVideoUrls() {
  // Динамический импорт после загрузки .env
  const { serverClient } = await import('../sanity/lib/server-client.js')
  
  console.log('🔧 Исправляем URL видео в Sanity...\n')

  // Получаем все проекты
  const projects = await serverClient.fetch(`*[_type == "portfolio"]`)

  for (const project of projects) {
    // Проверяем и исправляем videoUrl
    if (project.videoUrl && project.videoUrl.includes(' ')) {
      const fixedUrl = project.videoUrl.replace(/\s+/g, '')
      
      console.log(`📝 Исправляем: ${project.title}`)
      console.log(`   Было: ${project.videoUrl}`)
      console.log(`   Стало: ${fixedUrl}\n`)

      await serverClient
        .patch(project._id)
        .set({ videoUrl: fixedUrl })
        .commit()
    } else {
      console.log(`✅ ${project.title} - URL корректен`)
    }
  }

  console.log('\n✅ Готово!')
}

fixVideoUrls()

