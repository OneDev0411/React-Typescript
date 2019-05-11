export function isEmpty(fields) {
  return fields.some(item => !!item === false)
}
