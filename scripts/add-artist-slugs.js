const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

// Generate slug from name
function generateSlug(name) {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '') // Remove special characters
    .replace(/\s+/g, '-')         // Replace spaces with hyphens
    .replace(/-+/g, '-')          // Replace multiple hyphens with single
    .replace(/^-|-$/g, '')        // Remove leading/trailing hyphens
}

// Ensure unique slug
async function generateUniqueSlug(baseName, artistId = null) {
  let slug = generateSlug(baseName)
  let counter = 1
  
  while (true) {
    const existing = await prisma.artist.findUnique({
      where: { slug },
      select: { id: true }
    })
    
    if (!existing || existing.id === artistId) {
      return slug
    }
    
    slug = `${generateSlug(baseName)}-${counter}`
    counter++
  }
}

async function addArtistSlugs() {
  try {
    console.log('🎯 Adding slugs to artists...')
    
    const artists = await prisma.artist.findMany({
      where: { slug: null },
      select: { id: true, name: true }
    })
    
    console.log(`📋 Found ${artists.length} artists without slugs`)
    
    for (const artist of artists) {
      const slug = await generateUniqueSlug(artist.name, artist.id)
      
      await prisma.artist.update({
        where: { id: artist.id },
        data: { slug }
      })
      
      console.log(`✅ ${artist.name} → ${slug}`)
    }
    
    console.log(`🎉 Successfully added slugs to ${artists.length} artists!`)
    
  } catch (error) {
    console.error('❌ Error adding artist slugs:', error)
  } finally {
    await prisma.$disconnect()
  }
}

if (require.main === module) {
  addArtistSlugs()
}

module.exports = { generateUniqueSlug, generateSlug }