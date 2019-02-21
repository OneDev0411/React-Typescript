import { getContactOriginalSourceTitle } from 'utils/get-contact-original-source-title'

export function getValue(attribute) {
  const { attribute_def } = attribute
  const type = attribute_def.data_type
  let value = attribute[attribute_def.data_type]

  if (type === 'date') {
    return value || 0
  }

  if (attribute_def.name === 'source_type') {
    value = getContactOriginalSourceTitle(value)
  }

  return value || '-'
}
