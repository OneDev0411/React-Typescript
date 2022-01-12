const TYPE = 'contact'

export function list() {
  return [TYPE, 'list']
}

export function byId(id: UUID) {
  return [TYPE, 'get', id]
}
