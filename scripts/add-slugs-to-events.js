/**
 * Script to add slugs to existing events that don't have them
 */
const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

function generateSlug(text, maxLength = 100) {
  return text
    .toLowerCase()
    .trim()
    // Replace special characters and spaces with hyphens
    .replace(/[^\w\s-]/g, '')
    // Replace multiple spaces/hyphens with single hyphen
    .replace(/[\s_-]+/g, '-')
    // Remove leading/trailing hyphens
    .replace(/^-+|-+$/g, '')
    // Limit length
    .substring(0, maxLength)
    // Remove trailing hyphen if cut off mid-word
    .replace(/-+$/, '')
}

function generateEventSlug(title, date, venue) {
  let slug = generateSlug(title)
  
  // If we have a date, append year for uniqueness
  if (date) {
    const year = new Date(date).getFullYear()
    if (year && !isNaN(year)) {
      slug += `-${year}`
    }
  }
  
  // If slug is too short or generic, add venue for context
  if (slug.length < 10 && venue) {
    const venueSlug = generateSlug(venue, 20)
    slug += `-${venueSlug}`
  }
  
  return slug
}

async function addSlugsToEvents() {
  console.log('🔍 Finding events without slugs...')
  
  try {
    // Get all events without slugs
    const eventsWithoutSlugs = await prisma.event.findMany({
      where: {
        slug: null
      },
      include: {
        venue: true
      }
    })
    
    console.log(`📝 Found ${eventsWithoutSlugs.length} events without slugs`)
    
    if (eventsWithoutSlugs.length === 0) {
      console.log('✅ All events already have slugs!')
      return
    }
    
    for (const event of eventsWithoutSlugs) {
      try {
        const baseSlug = generateEventSlug(event.title, event.date, event.venue?.name)
        let slug = baseSlug
        let counter = 1
        
        // Check for uniqueness and append number if needed
        while (true) {
          const existing = await prisma.event.findUnique({
            where: { slug: slug }
          })
          
          if (!existing) {
            break // Slug is unique
          }
          
          slug = `${baseSlug}-${counter}`
          counter++
        }
        
        // Update the event with the new slug
        await prisma.event.update({
          where: { id: event.id },
          data: { slug: slug }
        })
        
        console.log(`✅ Updated "${event.title}" with slug: "${slug}"`)
        
      } catch (error) {
        console.error(`❌ Error updating event ${event.id}:`, error.message)
      }
    }
    
    console.log('🎉 Finished adding slugs to events!')
    
  } catch (error) {
    console.error('❌ Error:', error)
  } finally {
    await prisma.$disconnect()
  }
}

// Run the script
addSlugsToEvents()