/**
 * Utility functions for generating and managing URL slugs
 */

/**
 * Generate a URL-friendly slug from text
 * @param text - The text to convert to a slug
 * @param maxLength - Maximum length of the slug (default: 100)
 * @returns A URL-friendly slug
 */
export function generateSlug(text: string, maxLength: number = 100): string {
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

/**
 * Generate an event slug from event data
 * @param title - Event title
 * @param date - Event date (optional, for uniqueness)
 * @param venue - Venue name (optional, for context)
 * @returns A descriptive slug for the event
 */
export function generateEventSlug(
  title: string, 
  date?: string, 
  venue?: string
): string {
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

/**
 * Check if a slug is valid (basic validation)
 */
export function isValidSlug(slug: string): boolean {
  return /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug)
}

/**
 * Clean up an existing slug to ensure it's valid
 */
export function cleanSlug(slug: string): string {
  return generateSlug(slug)
}

/**
 * Generate slug suggestions from a title
 */
export function generateSlugSuggestions(title: string, count: number = 3): string[] {
  const baseSlug = generateSlug(title)
  const suggestions = [baseSlug]
  
  // Generate variations
  const words = title.toLowerCase().split(/\s+/)
  
  if (words.length > 2) {
    // Use first few words
    suggestions.push(generateSlug(words.slice(0, 3).join(' ')))
    // Use key words (longer than 3 chars)
    const keyWords = words.filter(word => word.length > 3)
    if (keyWords.length > 1) {
      suggestions.push(generateSlug(keyWords.slice(0, 3).join(' ')))
    }
  }
  
  return [...new Set(suggestions)].slice(0, count)
}