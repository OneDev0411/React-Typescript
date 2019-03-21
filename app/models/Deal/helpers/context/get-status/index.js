import { getField } from '../get-field'
import { getStatusField } from '../../dynamic-context'

export function getStatus(deal) {
  return deal.deleted_at ? 'Archived' : getField(deal, getStatusField(deal))
}
