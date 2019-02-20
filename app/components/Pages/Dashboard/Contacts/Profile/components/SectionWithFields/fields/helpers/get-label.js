export function getLabel(attribute) {
  const { attribute_def } = attribute
  let value = attribute[attribute_def.data_type]
  // let key = `${section}_attribute_${index}`

  // if (isPartner) {
  //   key = `partner_${key}`
  // }

  if (attribute.label) {
    return attribute.label
  }

  if (value && attribute_def.has_label && attribute_def.labels) {
    return attribute_def.labels[0]
  }

  return attribute_def.label
}
