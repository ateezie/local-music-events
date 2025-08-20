const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

// Generate a URL-friendly slug from a string
function generateSlug(text) {
  return text
    .toLowerCase()
    .trim()
    .replace(/[\s\W-]+/g, '-') // Replace spaces and non-word chars with hyphens
    .replace(/^-+|-+$/g, '') // Remove leading/trailing hyphens
    .replace(/-{2,}/g, '-') // Replace multiple consecutive hyphens with single
}

// Generate a unique venue slug
function generateVenueSlug(name, city) {
  let slug = generateSlug(name)
  
  // If city is provided and slug is too short, append city
  if (city && slug.length < 3) {
    slug = generateSlug(`${name} ${city}`)
  }
  
  return slug
}

async function addVenueSlugs() {
  try {
    console.log('🔄 Adding slugs to existing venues...')
    
    // Get all venues without slugs
    const venues = await prisma.venue.findMany({
      where: {
        slug: null
      }
    })
    
    console.log(`Found ${venues.length} venues without slugs`)
    
    for (const venue of venues) {
      let baseSlug = generateVenueSlug(venue.name, venue.city)
      
      // Ensure slug is unique
      let slug = baseSlug
      let counter = 1
      while (await prisma.venue.findUnique({ where: { slug } })) {
        slug = `${baseSlug}-${counter}`
        counter++
      }
      
      // Update venue with slug
      await prisma.venue.update({
        where: { id: venue.id },
        data: { slug }
      })
      
      console.log(`✅ Updated "${venue.name}" with slug: "${slug}"`)
    }
    
    console.log('🎉 All venue slugs added successfully!')
    
  } catch (error) {
    console.error('❌ Error adding venue slugs:', error)
  } finally {
    await prisma.$disconnect()
  }
}

addVenueSlugs()