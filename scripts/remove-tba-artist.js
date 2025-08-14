const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

async function removeTBAArticist() {
  try {
    // Find the TBA artist
    const tbaArtist = await prisma.artist.findFirst({
      where: {
        name: 'TBA'
      }
    })
    
    if (tbaArtist) {
      console.log('Found TBA artist:', tbaArtist.id)
      
      // Delete event-artist relationships first
      await prisma.eventArtist.deleteMany({
        where: {
          artistId: tbaArtist.id
        }
      })
      
      // Then delete the artist
      await prisma.artist.delete({
        where: {
          id: tbaArtist.id
        }
      })
      
      console.log('Successfully removed TBA artist')
    } else {
      console.log('No TBA artist found')
    }
  } catch (error) {
    console.error('Error removing TBA artist:', error)
  } finally {
    await prisma.$disconnect()
  }
}

removeTBAArticist()