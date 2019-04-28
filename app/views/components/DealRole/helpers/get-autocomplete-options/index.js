import _ from 'underscore'

export function getAutocompleteOptions(form, singularName, pluralName) {
  if (_.size(form) === 0) {
    return []
  }

  const values = form[pluralName] || []

  if (_.size(values) > 0) {
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
