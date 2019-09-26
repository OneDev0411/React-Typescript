export function getSide(deal: IDeal): string {
  const sides = {
    Buying: 'Buyer',
    Selling: 'Seller'
  }

  return sides[deal.deal_type]
}

export function isSelling(deal: IDeal): boolean {
  return deal.deal_type === 'Selling'
}

export function isBuying(deal: IDeal): boolean {
  return deal.deal_type === 'Buying'
}
