import { calculateWordWrap } from '../word-wrap'

export function getGroupValues(group, value) {
  const fields = {}
  const annotations = group.map(item => item.annotation)

  const { values } = calculateWordWrap(annotations, value)

  group.forEach((item, index) => {
    fields[item.annotation.fieldName] =
      value || value === 0 ? values[index] : ''
  })

  return fields
}
