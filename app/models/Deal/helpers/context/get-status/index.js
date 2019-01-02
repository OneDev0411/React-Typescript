import { getField } from '../get-field'

export function getStatus(deal) {
  return deal.deleted_at ? 'Archived' : getField(deal, 'listing_status')
}
