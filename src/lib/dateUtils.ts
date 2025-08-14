// Utility functions for consistent date formatting that avoids hydration issues

export function formatEventDateSafe(dateString: string): string {
  try {
    const date = new Date(dateString)
    // Use explicit options with 'en-US' locale to ensure consistency
    const options: Intl.DateTimeFormatOptions = { 
      weekday: 'short', 
      month: 'short', 
      day: 'numeric',
      timeZone: 'UTC' // Use UTC to avoid timezone differences between server and client
    }
    return date.toLocaleDateString('en-US', options)
  } catch (error) {
    return dateString // Fallback to original string if parsing fails
  }
}

export function formatEventDateShort(dateString: string): string {
  try {
    const date = new Date(dateString)
    // Simple format for hero component
    const options: Intl.DateTimeFormatOptions = { 
      month: 'short', 
      day: 'numeric',
      timeZone: 'UTC'
    }
    return date.toLocaleDateString('en-US', options)
  } catch (error) {
    return dateString // Fallback to original string if parsing fails
  }
}

export function isEventUpcoming(eventDate: string): boolean {
  try {
    const date = new Date(eventDate)
    const now = new Date()
    return date > now
  } catch (error) {
    return false
  }
}

export function formatEventTime(timeString: string): string {
  try {
    const [hours, minutes] = timeString.split(':')
    const hour = parseInt(hours)
    const ampm = hour >= 12 ? 'PM' : 'AM'
    const displayHour = hour % 12 || 12
    return `${displayHour}:${minutes} ${ampm}`
  } catch (error) {
    return timeString // Fallback to original string if parsing fails
  }
}