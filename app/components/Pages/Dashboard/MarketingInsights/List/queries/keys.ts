const TYPE = ['insights']

export function all() {
  return [TYPE]
}

export function allLists(status: string) {
  return [...all(), 'list', { status }]
}
