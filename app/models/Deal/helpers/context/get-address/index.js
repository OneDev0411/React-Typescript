import { getClientNames } from '../get-client-names'
import { getField } from '../get-field'

/**
 * a helper that extracts address from deal
 */
export function getAddress(deal, roles) {
  const address = getField(deal, 'full_address')

  if (!address || address.length === 0) {
    return getClientNames(deal, roles)
  }

  return address
}
