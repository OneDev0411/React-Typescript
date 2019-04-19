import { getField } from '../get-field'

export function getStatus(deal) {
  if (deal.deleted_at) {
    return 'Archived'
  }

  return getField(deal, 'contract_status') || getField(deal, 'listing_status')
}
