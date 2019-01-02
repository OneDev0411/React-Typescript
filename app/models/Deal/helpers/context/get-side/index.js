/**
 * get deal side
 */
export function getSide(deal) {
  const sides = {
    Buying: 'Buyer',
    Selling: 'Seller'
  }

  return sides[deal.deal_type]
}
