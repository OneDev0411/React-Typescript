export function getAutocompleteOptions(form, singularName, pluralName) {
  if (!form || !Object.values(form).length) {
    return []
  }

  const values = form[pluralName] || []

  if (!values || Object.values(values).length) {
    return values.map(item => {
      const value = item[item.attribute_def.data_type]

      return {
        value,
        label: value
      }
    })
  }

  // get single value
  const value = form[singularName]

  return value
    ? [
        {
          label: value,
          value
        }
      ]
    : []
}
