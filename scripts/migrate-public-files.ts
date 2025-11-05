/**
 * Script untuk migrasi file dari public folder ke Supabase Storage
 * 
 * Cara penggunaan:
 * 1. Pastikan semua environment variables sudah di-set
 * 2. Jalankan script ini dengan: npm run migrate:public
 * 3. Update database dengan URL baru dari hasil migrasi
 */

import { migratePublicFilesToStorage } from './lib/migrate-public-files'

async function main() {
  // Daftar file yang ingin di-migrate dari public folder
  const filesToMigrate = [
    // Hero images
    { publicPath: '/hero-bg.png', storagePath: 'static/hero-bg.png' },
    { publicPath: '/hero-bg-tr.png', storagePath: 'static/hero-bg-tr.png' },
    { publicPath: '/hero-pic-obj.png', storagePath: 'static/hero-pic-obj.png' },
    
    // Explore images
    { publicPath: '/explore-top.png', storagePath: 'static/explore-top.png' },
    
    // Placeholder images
    { publicPath: '/placeholder.svg', storagePath: 'static/placeholder.svg' },
    { publicPath: '/placeholder.jpg', storagePath: 'static/placeholder.jpg' },
    { publicPath: '/placeholder-logo.png', storagePath: 'static/placeholder-logo.png' },
    { publicPath: '/placeholder-logo.svg', storagePath: 'static/placeholder-logo.svg' },
    { publicPath: '/placeholder-user.jpg', storagePath: 'static/placeholder-user.jpg' },
    
    // Default fallback images (jika ada)
    { publicPath: '/dirt-bike-trail-landscape.jpg', storagePath: 'static/dirt-bike-trail-landscape.jpg' },
    { publicPath: '/off-road-motorcycle.jpg', storagePath: 'static/off-road-motorcycle.jpg' },
    { publicPath: '/extreme-bike-riding.jpg', storagePath: 'static/extreme-bike-riding.jpg' },
    { publicPath: '/motorcycle-helmet-protective-gear.jpg', storagePath: 'static/motorcycle-helmet-protective-gear.jpg' },
    { publicPath: '/motorcycle-gloves-boots.jpg', storagePath: 'static/motorcycle-gloves-boots.jpg' },
    { publicPath: '/professional-bike-rider.jpg', storagePath: 'static/professional-bike-rider.jpg' },
    { publicPath: '/adventure-guide.jpg', storagePath: 'static/adventure-guide.jpg' },
  ]

  console.log('Starting migration of public files to Supabase Storage...')
  console.log(`Total files to migrate: ${filesToMigrate.length}`)

  const results = await migratePublicFilesToStorage(filesToMigrate)

  console.log('\nMigration Results:')
  console.log('==================')
  
  results.forEach((result, index) => {
    if (result.url) {
      console.log(`✅ [${index + 1}/${results.length}] ${result.publicPath} -> ${result.url}`)
    } else {
      console.log(`❌ [${index + 1}/${results.length}] ${result.publicPath} -> FAILED`)
    }
  })

  const successCount = results.filter(r => r.url).length
  const failCount = results.filter(r => !r.url).length

  console.log('\nSummary:')
  console.log(`✅ Success: ${successCount}`)
  console.log(`❌ Failed: ${failCount}`)
  console.log('\nNote: Update your code/database with the new URLs above')
}

main().catch(console.error)

