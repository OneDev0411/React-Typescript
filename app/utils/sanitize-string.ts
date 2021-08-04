/**
 * This function replaces one or multiple whitespace characters with a space.
 * @param text input value
 * @returns the sanitized string
 */
export function sanitizeWhitespace(text: string): string {
  return text.replace(/\s+/, ' ')
}

/**
 * This function calls `sanitizeWhitespace` then makes the output lowercase
 * and trimmed.
 * @param text input value
 * @returns the sanitized string
 */
export function sanitizeSearchTerm(text: string): string {
  return sanitizeWhitespace(text).toLowerCase().trim()
}
