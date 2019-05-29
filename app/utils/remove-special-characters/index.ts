/**
 * Removing some speacial characters.
 *
 * @param {string} text
 * @returns {string}
 */
export default function removeSpecialCharacters(text: string) {
  return text.trim().replace(/[~`!#$%^&*(){}=<>?,:;"\]\[\/\\]/g, '')
}
