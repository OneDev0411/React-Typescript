export function selectSellingDeals(deals: IDeal[]): IDeal[] {
  // TODO: Support deals without listing into the Open House Drawer
  return deals.filter(deal => deal.deal_type === 'Selling' && deal.listing)
}
