import { getContext } from 'models/Deal/helpers/context'
import {
  searchContext,
  filterByStatus
} from 'models/Deal/helpers/dynamic-context'

export function showStatusQuestion(
  deal: IDeal | null,
  dealType: 'Selling' | 'Buying',
  contextName: 'listing_status' | 'contract_status'
) {
  if (!deal) {
    return false
  }

  const definition = searchContext(deal.id, contextName)
  const dealContext = getContext(deal, contextName)

  const isRequired = filterByStatus(
    definition,
    dealType,
    deal.property_type,
    deal.has_active_offer,
    'required'
  )

  if (isRequired === false) {
    return false
  }

  if (
    deal.listing &&
    definition?.preffered_source === 'MLS' &&
    dealContext?.source === 'MLS'
  ) {
    return false
  }

  return true
}
