import { defaultTags } from 'utils/default-tags'
import { sortAlphabetically } from 'utils/helpers'

const getUniqTags = tags => {
  if (!Array.isArray(tags) || tags.length === 0) {
    return []
  }

  return [...new Set([...defaultTags, ...tags.map(({ text }) => text)])]
    .sort(sortAlphabetically)
    .map(tag => ({ label: tag, value: tag }))
}

export default getUniqTags
