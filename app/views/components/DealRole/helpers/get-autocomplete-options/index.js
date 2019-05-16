export function getAutocompleteOptions(form, pluralName) {
  if (!form || !Array.isArray(form[pluralName])) {
    return []
  }

  return form[pluralName].map(value => ({
    label: value,
    value
  }))
}
