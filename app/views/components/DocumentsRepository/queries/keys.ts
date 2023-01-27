const TYPE = ['documents_repository']

export function all() {
  return [TYPE]
}

export function list() {
  return [...all(), 'list']
}
