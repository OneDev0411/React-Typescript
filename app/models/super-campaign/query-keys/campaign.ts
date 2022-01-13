const TYPE = 'super_campaign'

export function getAll(order: string[] = []) {
  return [TYPE, 'getAll', { order }]
}
