export function normalizeDropdownItems(items) {
  if (typeof items !== 'object') {
    return []
  }

  if (Array.isArray(items)) {
    return items.map(item => ({ label: item, value: item }))
  }

  return Object.keys(items).map(item => ({ label: items[item], value: item }))
}
