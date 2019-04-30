export function cleanSearchQuery(text) {
  return text.replace(/[~`!#$%^&*(){}=<>?,:;'"\]\[\/\\]/g, '')
}
