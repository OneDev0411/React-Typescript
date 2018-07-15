export function getPlaceholder({ attribute_def }) {
  if (attribute_def.data_type === 'date') {
    return 'MM/DD/YYYY'
  }

  return attribute_def.label
}
