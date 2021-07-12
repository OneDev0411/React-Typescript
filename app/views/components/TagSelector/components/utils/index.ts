import { SelectorOption } from '../../type'

/**
 * return a normalize version of tags for Autocomplete component
 * @param {any[]} tags - all tags
 */
export const normalizeTags = (tags: any[]): SelectorOption[] => {
  return tags.map(tag => ({
    value: tag.tag,
    title: tag.text
  }))
}

/**
 * return a tag keys
 * @param {any[]} tags - all tags
 */
export const getTagKeys = (tags: any[]): string[] => {
  return tags.map(tag => {
    if (typeof tag.tag === 'string') {
      return tag.tag.toLowerCase()
    }
  })
}
