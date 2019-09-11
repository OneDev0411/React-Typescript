import { sortAlphabetically } from 'utils/helpers'

const getUniqTags = tags => {
  if (!Array.isArray(tags) || tags.length === 0) {
    return []
  }

  return tags
    .map(({ text }) => text)
    .sort(sortAlphabetically)
    .map(tag => ({ label: tag, value: tag }))
}

export default getUniqTags
