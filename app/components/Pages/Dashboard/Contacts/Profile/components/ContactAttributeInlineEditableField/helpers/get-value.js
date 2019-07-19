import { getContactOriginalSourceTitle } from 'utils/get-contact-original-source-title'

import { getDateValues } from 'components/inline-editable-fields/InlineDateField/helpers'

export function getValue(attribute) {
  const { attribute_def } = attribute
  let value = attribute[attribute_def.data_type]

  if (attribute_def.name === 'source_type') {
    value = getContactOriginalSourceTitle(value)
  }

  if (attribute_def.data_type === 'date') {
    value = getDateValues(value)
  }

  return value || ''
}
