import { getContactOriginalSourceTitle } from 'utils/get-contact-original-source-title'

export function getValue(attribute) {
  const { attribute_def } = attribute
  let value = attribute[attribute_def.data_type]
  // let key = `${section}_attribute_${index}`

  // if (isPartner) {
  //   key = `partner_${key}`
  // }

  if (attribute_def.name === 'source_type') {
    value = getContactOriginalSourceTitle(value)
  }

  return value || '-'
}
