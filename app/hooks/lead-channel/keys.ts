const TYPE = ['accounts_lead_channels']

export function all() {
  return [TYPE]
}

export function list() {
  return [...all(), 'list']
}
