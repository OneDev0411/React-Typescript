export function getSide(deal: IDeal): string {
  const isLeasing = deal.property_type.is_lease

  const saleTypes = {
    Buying: 'Buyer',
    Selling: 'Seller'
  }

  const leaseTypes = {
    Buying: 'Tenant',
    Selling: 'Landlord'
  }

  return isLeasing ? leaseTypes[deal.deal_type] : saleTypes[deal.deal_type]
}

export function isSelling(deal: IDeal): boolean {
  return deal.deal_type === 'Selling'
}

export function isBuying(deal: IDeal): boolean {
  return deal.deal_type === 'Buying'
}
