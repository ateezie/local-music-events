const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

async function testUpdate() {
  try {
    console.log('Testing event update with subGenres...')
    
    // Try to update the event with hero = true
    const updated = await prisma.event.update({
      where: { id: 'db-1755125269810' },
      data: {
        hero: true,
        subGenres: null // Try with null first
      }
    })
    
    console.log('✅ Update successful:', {
      id: updated.id,
      hero: updated.hero,
      subGenres: updated.subGenres
    })
    
  } catch (error) {
    console.error('❌ Update failed:', error.message)
  } finally {
    await prisma.$disconnect()
  }
}

testUpdate()