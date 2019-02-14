export function normalizeDropdownItems(items) {
  if (typeof items !== 'object') {
    return []
  }

  if (Array.isArray(items)) {
    return items.map(value => ({ title: value, value }))
  }

  return Object.keys(items).map(value => ({
    title: items[value],
    value
  }))
}
