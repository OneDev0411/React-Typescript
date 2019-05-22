import isUUID from 'validator/lib/isUUID'

export function idIsUUID(item) {
  return !!item.id && isUUID(item.id)
}
