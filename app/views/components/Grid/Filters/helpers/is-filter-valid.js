export function isFilterValid(filter) {
  return (
    filter.operator && Array.isArray(filter.values) && filter.values.length > 0
  )
}
