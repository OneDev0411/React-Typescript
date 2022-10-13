const TYPE = ['insights']

export function all() {
  return [TYPE]
}

export function allLists() {
  return [...all(), 'list']
}
