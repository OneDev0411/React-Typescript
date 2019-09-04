export const defaultTags: string[] = [
  'Warm List',
  'Hot List',
  'Past Client',
  'Seller',
  'Agent',
  'Contractor',
  'Closing Officer',
  'Buyer'
]

export const formatedDefaultTags: {
  text: string
  type: 'default_tag'
}[] = defaultTags.map(tag => ({
  text: tag,
  type: 'default_tag'
}))
