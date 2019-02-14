export function getUpsertAttributes(newAddress, originalAddress, attributes) {
  const indexedAttributes = {}

  attributes.forEach(attribute => {
    indexedAttributes[attribute.attribute_def.name] = attribute
  })

  const fields = []

  const { values, label, is_primary } = newAddress

  if (Object.keys(values).length > 0) {
    Object.keys(values).forEach(key => {
      const attribute = indexedAttributes[key]

      fields.push({
        ...attribute,
        is_primary,
        label,
        [attribute.attribute_def.data_type]: values[key] || ''
      })
    })
  }

  if (
    is_primary !== originalAddress.is_primary ||
    label !== originalAddress.label.value
  ) {
    attributes.forEach(attribute => {
      if (attribute.id && !values[attribute.attribute_def.name]) {
        fields.push({
          ...attribute,
          is_primary,
          label
        })
      }
    })
  }

  return fields
}
