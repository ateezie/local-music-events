const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

// Generate slug function (copied from src/lib/slug.ts)
function generateSlug(text, maxLength = 100) {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .substring(0, maxLength)
    .replace(/-+$/, '')
}

function generateEventSlug(title, date, venue) {
  let slug = generateSlug(title)
  
  if (date) {
    const year = new Date(date).getFullYear()
    if (year && !isNaN(year)) {
      slug += `-${year}`
    }
  }
  
  if (slug.length < 10 && venue) {
    const venueSlug = generateSlug(venue, 20)
    slug += `-${venueSlug}`
  }
  
  return slug
}

async function addMissingSlugs() {
  try {
    console.log('🔍 Finding events without slugs...')
    
    // Find events that don't have slugs
    const eventsWithoutSlugs = await prisma.event.findMany({
      where: {
        OR: [
          { slug: null },
          { slug: '' }
        ]
      },
      include: {
        venue: true
      }
    })
    
    console.log(`📝 Found ${eventsWithoutSlugs.length} events without slugs`)
    
    for (const event of eventsWithoutSlugs) {
      console.log(`\n🎵 Processing: "${event.title}"`)
      
      // Generate slug
      const slug = generateEventSlug(event.title, event.date, event.venue?.name)
      console.log(`   Generated slug: "${slug}"`)
      
      // Check if slug already exists
      let finalSlug = slug
      let counter = 1
      
      while (true) {
        const existing = await prisma.event.findFirst({
          where: { 
            slug: finalSlug,
            id: { not: event.id }
          }
        })
        
        if (!existing) break
        
        finalSlug = `${slug}-${counter}`
        counter++
        console.log(`   Slug conflict, trying: "${finalSlug}"`)
      }
      
      // Update the event with the slug
      await prisma.event.update({
        where: { id: event.id },
        data: { slug: finalSlug }
      })
      
      console.log(`   ✅ Updated event ${event.id} with slug: "${finalSlug}"`)
    }
    
    console.log('\n🎉 All events now have slugs!')
    
  } catch (error) {
    console.error('❌ Error adding slugs:', error)
  } finally {
    await prisma.$disconnect()
  }
}

addMissingSlugs()