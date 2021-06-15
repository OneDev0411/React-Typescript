export function getStatusContextKey(
  deal: IDeal
): 'contract_status' | 'listing_status' {
  return deal?.deal_type === 'Buying' || deal?.has_active_offer
    ? 'contract_status'
    : 'listing_status'
}
