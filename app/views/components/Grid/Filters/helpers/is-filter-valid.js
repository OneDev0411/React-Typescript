export function isFilterValid(filter) {
  return filter.operator && filter.values && filter.values.length > 0
}
