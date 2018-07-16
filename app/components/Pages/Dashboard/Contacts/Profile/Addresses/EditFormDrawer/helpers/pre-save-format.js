export function preSaveFormat(values) {
  let upsertList = []

  values.addresses.forEach(address => {
    Object.values(address).forEach(field => {
      if (!field.attribute) {
        return
      }

      const attributeType = field.attribute.attribute_def.data_type
      const is_primary = values.is_primary === field.attribute.index

      const addField = field => {
        upsertList.push({
          ...field.attribute,
          [attributeType]: field.value,
          is_primary,
          label: address.label.value
        })
      }

      if (field.attribute.id) {
        if (
          field.attribute[attributeType] !== field.value ||
          field.attribute.is_primary !== is_primary ||
          field.attribute.label !== address.label.value
        ) {
          addField(field)
        }
      } else if (field.value) {
        addField(field)
      }
    })
  })

  return upsertList
}
