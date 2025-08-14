const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

async function checkSchema() {
  try {
    // Try to create an event with subGenres to see if it's supported
    console.log('Testing subGenres field in Prisma...')
    
    // First, let's see what fields Prisma thinks are available
    const eventModel = await prisma.event.findFirst()
    console.log('Sample event fields:', Object.keys(eventModel || {}))
    
    // Check if we can query the field
    const events = await prisma.event.findMany({
      select: {
        id: true,
        title: true,
        subGenres: true
      },
      take: 1
    })
    
    console.log('✅ subGenres field is accessible:', events)
    
  } catch (error) {
    console.error('❌ Error with subGenres field:', error.message)
  } finally {
    await prisma.$disconnect()
  }
}

checkSchema()