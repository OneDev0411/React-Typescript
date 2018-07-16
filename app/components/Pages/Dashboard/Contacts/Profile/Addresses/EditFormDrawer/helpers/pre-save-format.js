export function preSaveFormat(values) {
  let upsertList = []

  values.addresses.forEach(address => {
    Object.values(address).forEach(field => {
      if (!field.attribute) {
        return
      }

      const attributeType = field.attribute.attribute_def.data_type

      const addField = field => {
        upsertList.push({
          ...field.attribute,
          label: address.label.value,
          is_primary: values.is_primary === field.attribute.index,
          [attributeType]: field.value
        })
      }

      if (field.attribute.id) {
        if (field.attribute[attributeType] !== field.value) {
          addField(field)
        }
      } else if (field.value) {
        addField(field)
      }
    })
  })

  return upsertList
}
