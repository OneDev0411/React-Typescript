import Deal from 'models/Deal'

export function getDealTitle(deal) {
  return Deal.get.field(deal, 'street_address') || deal.title
}
