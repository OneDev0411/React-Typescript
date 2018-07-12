export function preSaveFormat(values) {
  const attribute = {
    editable: true,
    has_label: false,
    required: false,
    searchable: true,
    singular: true
  }

  Object.keys(values).forEach(field => {
    const value = values[field]

    if (!value || (Array.isArray(value) && value.filter(i => i).length === 0)) {
      attribute[field] = null
    } else if (value.value) {
      attribute[field] = value.value
    } else {
      attribute[field] = value
    }
  })

  if (Array.isArray(attribute.labels) && attribute.labels.length > 0) {
    attribute.singular = false
    attribute.has_label = true
  }

  return attribute
}
