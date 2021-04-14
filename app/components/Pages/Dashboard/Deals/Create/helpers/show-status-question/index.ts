import { getContext } from 'models/Deal/helpers/context'

import { searchContext } from 'models/Deal/helpers/brand-context/search-context'
import { isRequiredContext } from 'models/Deal/helpers/brand-context/is-required-context'

export function showStatusQuestion(
  deal: IDeal | null,
  dealType: 'Selling' | 'Buying',
  contextName: 'listing_status' | 'contract_status'
) {
  if (!deal) {
    return false
  }

  const definition = searchContext(deal, contextName)
  const dealContext = getContext(deal, contextName)

  if (!definition) {
    return false
  }

  const isRequired = isRequiredContext(deal, definition.key)

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
