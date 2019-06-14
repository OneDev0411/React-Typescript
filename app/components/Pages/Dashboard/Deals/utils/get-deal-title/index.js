import Deal from 'models/Deal'

export function getDealTitle(deal) {
  const title = Deal.get.field(deal, 'street_address') || deal.title

  return title && title.trim()
}
