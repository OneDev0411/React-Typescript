import { getAttributeValue } from '../get-attribute-value'

export function getRolesList({ roles, values, annotation, rectIndex }) {
  if (roles.length === 0) {
    return []
  }

  if (annotation.type === 'Role' && roles.length === 1) {
    return [
      {
        ...roles[0],
        value: values[rectIndex]
      }
    ]
  }

  const valuesList = Object.entries(values).map(([, value]) => value)

  let cursor = 0

  const groups = roles.reduce((acc, role) => {
    const roleItem =
      annotation.type === 'Roles' ? role : roles[annotation.number]

    const text = getAttributeValue(roleItem, annotation)

    if (!text) {
      return acc
    }

    const index = valuesList
      .join(' ')
      .substring(cursor)
      .indexOf(text)

    if (index === -1) {
      return acc
    }

    const texts = getRoleGroups(valuesList, text, cursor + index)

    Object.entries(texts).forEach(([groupIndex, groupValue]) => {
      acc[groupIndex] = [
        ...(acc[groupIndex] || []),
        {
          ...roleItem,
          value: groupValue
        }
      ]
    })

    cursor = index + text.length

    return acc
  }, {})

  return groups[rectIndex] || []
}

function getRoleGroups(valuesList, text, textIndex) {
  let cursor = 0
  const cling = valuesList.join(' ')

  // find and match all non-splitted attributes
  const values = valuesList.reduce((list, value, groupIndex) => {
    if (
      textIndex >= cursor &&
      textIndex + text.length - 1 <= cursor + value.length
    ) {
      list[groupIndex] = text
    }

    cursor += value.length

    return list
  }, {})

  // if there is at least one occurance it means the word isn't splitted
  // and so thanks God
  if (Object.keys(values).length > 0) {
    return values
  }

  if (!cling.includes(text)) {
    return {}
  }

  // if there is no occurance it means the word is splitted and
  // we should find and calculate the splitted text of each group
  cursor = 0

  return valuesList.reduce((list, value, groupIndex) => {
    if (textIndex < cursor) {
      list[groupIndex] =
        // check if text covers the entire of annotation value or just clinged
        // to the begining of the value
        textIndex + text.length > cursor + value.length
          ? value
          : text.substring(cursor - textIndex).trim()
    }

    // clinged to the end of the value
    if (textIndex > cursor) {
      list[groupIndex] = cling.substring(textIndex, value.length)
    }

    cursor += value.length

    return list
  }, {})
}
