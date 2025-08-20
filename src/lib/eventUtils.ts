// Event utility functions for calendar and sharing

export interface CalendarEvent {
  title: string
  description: string
  startDate: Date
  endDate: Date
  location: string
  url?: string
}

/**
 * Generates an ICS (iCalendar) file content for the event
 */
export function generateICSFile(event: CalendarEvent): string {
  // Format dates in UTC (YYYYMMDDTHHMMSSZ)
  const formatICSDate = (date: Date): string => {
    return date.toISOString().replace(/[-:]/g, '').replace(/\.\d{3}/, '')
  }

  // Create a unique identifier for the event
  const uid = `event-${Date.now()}@localmusicevents.com`
  const timestamp = formatICSDate(new Date())
  
  // Escape text for ICS format
  const escapeICS = (text: string): string => {
    return text
      .replace(/\\/g, '\\\\')
      .replace(/;/g, '\\;')
      .replace(/,/g, '\\,')
      .replace(/\n/g, '\\n')
      .replace(/\r/g, '')
  }

  const icsContent = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//Local Music Events//Event Calendar//EN',
    'CALSCALE:GREGORIAN',
    'METHOD:PUBLISH',
    'BEGIN:VEVENT',
    `UID:${uid}`,
    `DTSTAMP:${timestamp}`,
    `DTSTART:${formatICSDate(event.startDate)}`,
    `DTEND:${formatICSDate(event.endDate)}`,
    `SUMMARY:${escapeICS(event.title)}`,
    `DESCRIPTION:${escapeICS(event.description)}`,
    `LOCATION:${escapeICS(event.location)}`,
    event.url ? `URL:${event.url}` : '',
    'STATUS:CONFIRMED',
    'SEQUENCE:0',
    'END:VEVENT',
    'END:VCALENDAR'
  ].filter(line => line !== '').join('\r\n')

  return icsContent
}

/**
 * Downloads an ICS file to the user's device
 */
export function downloadICSFile(icsContent: string, filename: string): void {
  const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' })
  const url = URL.createObjectURL(blob)
  
  const link = document.createElement('a')
  link.href = url
  link.download = filename
  link.style.display = 'none'
  
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  
  // Clean up the URL object
  setTimeout(() => URL.revokeObjectURL(url), 100)
}

/**
 * Generates calendar URLs for various services
 */
export function generateCalendarUrls(event: CalendarEvent) {
  const formatGoogleDate = (date: Date): string => {
    return date.toISOString().replace(/[-:]/g, '').replace(/\.\d{3}Z/, 'Z')
  }

  const formatOutlookDate = (date: Date): string => {
    return date.toISOString()
  }

  const startTime = formatGoogleDate(event.startDate)
  const endTime = formatGoogleDate(event.endDate)
  
  const encodedTitle = encodeURIComponent(event.title)
  const encodedDescription = encodeURIComponent(event.description)
  const encodedLocation = encodeURIComponent(event.location)

  return {
    google: `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodedTitle}&dates=${startTime}/${endTime}&details=${encodedDescription}&location=${encodedLocation}`,
    
    outlook: `https://outlook.live.com/calendar/0/deeplink/compose?subject=${encodedTitle}&startdt=${formatOutlookDate(event.startDate)}&enddt=${formatOutlookDate(event.endDate)}&body=${encodedDescription}&location=${encodedLocation}`,
    
    yahoo: `https://calendar.yahoo.com/?v=60&view=d&type=20&title=${encodedTitle}&st=${startTime}&dur=false&et=${endTime}&desc=${encodedDescription}&in_loc=${encodedLocation}`
  }
}

/**
 * Share event using Web Share API or fallback methods
 */
export async function shareEvent(eventData: {
  title: string
  description: string
  url: string
}): Promise<boolean> {
  // Check if Web Share API is supported
  if (navigator.share) {
    try {
      await navigator.share({
        title: eventData.title,
        text: eventData.description,
        url: eventData.url
      })
      return true
    } catch (error) {
      console.log('Web Share API failed:', error)
      // Fall through to fallback methods
    }
  }

  // Fallback: copy to clipboard
  try {
    const shareText = `${eventData.title}\n\n${eventData.description}\n\n${eventData.url}`
    await navigator.clipboard.writeText(shareText)
    return true
  } catch (error) {
    console.log('Clipboard API failed:', error)
    return false
  }
}

/**
 * Generate social media sharing URLs
 */
export function generateSocialShareUrls(eventData: {
  title: string
  description: string
  url: string
}) {
  const encodedTitle = encodeURIComponent(eventData.title)
  const encodedDescription = encodeURIComponent(eventData.description)
  const encodedUrl = encodeURIComponent(eventData.url)
  const shareText = encodeURIComponent(`${eventData.title} - ${eventData.description}`)

  return {
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}&quote=${shareText}`,
    
    twitter: `https://twitter.com/intent/tweet?text=${shareText}&url=${encodedUrl}`,
    
    linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`,
    
    email: `mailto:?subject=${encodedTitle}&body=${encodedDescription}%0A%0A${encodedUrl}`,
    
    whatsapp: `https://wa.me/?text=${shareText}%20${encodedUrl}`,
    
    telegram: `https://t.me/share/url?url=${encodedUrl}&text=${shareText}`
  }
}

/**
 * Generate a URL-friendly slug from a string
 */
export function generateSlug(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[\s\W-]+/g, '-') // Replace spaces and non-word chars with hyphens
    .replace(/^-+|-+$/g, '') // Remove leading/trailing hyphens
    .replace(/-{2,}/g, '-') // Replace multiple consecutive hyphens with single
}

/**
 * Generate a unique venue slug
 */
export function generateVenueSlug(name: string, city?: string): string {
  let slug = generateSlug(name)
  
  // If city is provided and slug is too short, append city
  if (city && slug.length < 3) {
    slug = generateSlug(`${name} ${city}`)
  }
  
  return slug
}

/**
 * Format event date and time for calendar
 */
export function parseEventDateTime(eventDate: string, eventTime: string): {
  startDate: Date
  endDate: Date
} {
  // Parse the date
  const date = new Date(eventDate)
  
  // Parse the time and set it on the date
  if (eventTime) {
    const timeMatch = eventTime.match(/(\d{1,2}):?(\d{2})?\s*(AM|PM)/i)
    if (timeMatch) {
      let hours = parseInt(timeMatch[1])
      const minutes = parseInt(timeMatch[2] || '0')
      const period = timeMatch[3].toUpperCase()
      
      if (period === 'PM' && hours !== 12) {
        hours += 12
      } else if (period === 'AM' && hours === 12) {
        hours = 0
      }
      
      date.setHours(hours, minutes, 0, 0)
    }
  }
  
  // Assume event duration of 3 hours if no end time specified
  const endDate = new Date(date)
  endDate.setHours(date.getHours() + 3)
  
  return {
    startDate: date,
    endDate: endDate
  }
}