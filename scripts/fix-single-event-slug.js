/**
 * Script to fix the slug for a specific event
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

async function fixEventSlug() {
  try {
    const eventId = 'db-1755041911450'
    
    // Get the specific event
    const event = await prisma.event.findUnique({
      where: { id: eventId },
      include: { venue: true }
    })
    
    if (!event) {
      console.log('❌ Event not found')
      return
    }
    
    console.log('📝 Current event:', {
      id: event.id,
      title: event.title,
      slug: event.slug,
      date: event.date
    })
    
    if (event.slug) {
      console.log('✅ Event already has a slug:', event.slug)
      return
    }
    
    // Generate slug
    const slug = generateEventSlug(event.title, event.date, event.venue?.name)
    console.log('🔧 Generated slug:', slug)
    
    // Update the event
    const updatedEvent = await prisma.event.update({
      where: { id: eventId },
      data: { slug: slug }
    })
    
    console.log('✅ Updated event slug:', updatedEvent.slug)
    
  } catch (error) {
    console.error('❌ Error:', error)
  } finally {
    await prisma.$disconnect()
  }
}

// Run the script
fixEventSlug()