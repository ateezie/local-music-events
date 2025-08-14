import { NextRequest, NextResponse } from 'next/server'
import { writeFileSync, existsSync, mkdirSync } from 'fs'
import { join } from 'path'
import { v4 as uuidv4 } from 'uuid'

export async function POST(request: NextRequest) {
  try {
    const { imageUrl } = await request.json()
    
    if (!imageUrl) {
      return NextResponse.json(
        { error: 'No image URL provided' },
        { status: 400 }
      )
    }

    console.log('Proxy Image: Fetching from Facebook:', imageUrl)

    // Fetch image from Facebook server-side with enhanced headers
    const response = await fetch(imageUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36',
        'Accept': 'image/webp,image/apng,image/*,*/*;q=0.8',
        'Accept-Language': 'en-US,en;q=0.9',
        'Accept-Encoding': 'gzip, deflate, br',
        'Referer': 'https://www.facebook.com/',
        'Origin': 'https://www.facebook.com',
        'Sec-Fetch-Dest': 'image',
        'Sec-Fetch-Mode': 'cors',
        'Sec-Fetch-Site': 'same-site',
        'sec-ch-ua': '"Google Chrome";v="131", "Chromium";v="131", "Not_A Brand";v="24"',
        'sec-ch-ua-mobile': '?0',
        'sec-ch-ua-platform': '"Windows"',
        'Cache-Control': 'no-cache',
        'Pragma': 'no-cache'
      }
    })

    if (!response.ok) {
      console.error('Proxy Image: Failed to fetch from Facebook:', response.status, response.statusText)
      return NextResponse.json(
        { error: `Failed to fetch image: ${response.status} ${response.statusText}` },
        { status: 400 }
      )
    }

    // Get image data
    const imageBuffer = await response.arrayBuffer()
    const buffer = Buffer.from(imageBuffer)
    
    console.log('Proxy Image: Downloaded image, size:', buffer.length)

    // Try uploading to external hosting services
    let hostedImageUrl = ''
    
    // Try file.io first (simple, no API key required)
    try {
      console.log('Proxy Image: Attempting file.io upload...')
      
      const formData = new FormData()
      const blob = new Blob([buffer], { type: 'image/jpeg' })
      formData.append('file', blob, 'event-image.jpg')
      
      const response = await fetch('https://file.io', {
        method: 'POST',
        body: formData
      })
      
      console.log('Proxy Image: file.io response status:', response.status)
      
      if (response.ok) {
        const data = await response.json()
        console.log('Proxy Image: file.io response data:', data)
        if (data.success && data.link) {
          hostedImageUrl = data.link
          console.log('Proxy Image: Successfully uploaded to file.io:', hostedImageUrl)
        } else {
          console.warn('Proxy Image: file.io response format unexpected:', data)
        }
      } else {
        const errorText = await response.text()
        console.warn('Proxy Image: file.io upload failed with status:', response.status, errorText)
      }
    } catch (error) {
      console.warn('Proxy Image: file.io upload failed:', error)
    }
    
    // Try catbox.moe as backup if 0x0.st failed
    if (!hostedImageUrl) {
      try {
        console.log('Proxy Image: Attempting catbox.moe upload...')
        
        const formData = new FormData()
        const blob = new Blob([buffer], { type: 'image/jpeg' })
        formData.append('fileToUpload', blob, 'event-image.jpg')
        formData.append('reqtype', 'fileupload')
        
        const response = await fetch('https://catbox.moe/user/api.php', {
          method: 'POST',
          body: formData
        })
        
        console.log('Proxy Image: catbox.moe response status:', response.status)
        
        if (response.ok) {
          const hostedUrl = await response.text()
          const cleanUrl = hostedUrl.trim()
          if (cleanUrl.startsWith('https://files.catbox.moe/')) {
            hostedImageUrl = cleanUrl
            console.log('Proxy Image: Successfully uploaded to catbox.moe:', hostedImageUrl)
          } else {
            console.warn('Proxy Image: catbox.moe response format unexpected:', cleanUrl)
          }
        } else {
          const errorText = await response.text()
          console.warn('Proxy Image: catbox.moe upload failed with status:', response.status, errorText)
        }
      } catch (error) {
        console.warn('Proxy Image: catbox.moe upload failed:', error)
      }
    }
    
    // Fallback to local storage if external hosting fails
    if (!hostedImageUrl) {
      console.log('Proxy Image: External hosting failed, saving locally as fallback...')
      
      // Determine file extension from content type or URL
      const contentType = response.headers.get('content-type') || ''
      let extension = 'jpg'
      if (contentType.includes('png')) extension = 'png'
      else if (contentType.includes('gif')) extension = 'gif'
      else if (contentType.includes('webp')) extension = 'webp'
      
      // Generate unique filename
      const filename = `facebook-event-${uuidv4()}.${extension}`
      
      // Ensure upload directory exists
      const uploadDir = join(process.cwd(), 'public/images/uploads')
      if (!existsSync(uploadDir)) {
        mkdirSync(uploadDir, { recursive: true })
      }

      // Save the image
      const filepath = join(uploadDir, filename)
      writeFileSync(filepath, buffer)

      // Return the public URL
      hostedImageUrl = `/images/uploads/${filename}`
      console.log('Proxy Image: Saved locally as fallback:', hostedImageUrl)
    }

    const jsonResponse = NextResponse.json({
      success: true,
      url: hostedImageUrl,
      originalUrl: imageUrl,
      size: buffer.length,
      service: hostedImageUrl.includes('file.io') ? 'fileio' : 
               hostedImageUrl.includes('catbox.moe') ? 'catbox' : 'local'
    })
    
    // Add CORS headers to allow requests from Facebook
    jsonResponse.headers.set('Access-Control-Allow-Origin', '*')
    jsonResponse.headers.set('Access-Control-Allow-Methods', 'POST, OPTIONS')
    jsonResponse.headers.set('Access-Control-Allow-Headers', 'Content-Type')
    
    return jsonResponse

  } catch (error) {
    console.error('Proxy Image: Error processing request:', error)
    const errorResponse = NextResponse.json(
      { error: 'Failed to proxy image' },
      { status: 500 }
    )
    
    // Add CORS headers to error response too
    errorResponse.headers.set('Access-Control-Allow-Origin', '*')
    errorResponse.headers.set('Access-Control-Allow-Methods', 'POST, OPTIONS')
    errorResponse.headers.set('Access-Control-Allow-Headers', 'Content-Type')
    
    return errorResponse
  }
}

// Handle preflight requests for CORS
export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      'Access-Control-Max-Age': '86400',
    },
  })
}