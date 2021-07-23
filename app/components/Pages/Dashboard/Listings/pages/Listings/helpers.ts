function sanitizeWhitespace(text: string): string {
  return text.replace(/\s+/, ' ')
}

export function sanitizeSearchTerm(text: string): string {
  return sanitizeWhitespace(text).toLowerCase().trim()
}
