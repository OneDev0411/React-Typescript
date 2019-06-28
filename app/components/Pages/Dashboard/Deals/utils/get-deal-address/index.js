import { getField } from 'models/Deal/helpers/context/get-field'

export function getDealAddress(deal) {
  const city = getField(deal, 'city') || ''
  const state = getField(deal, 'state') || ''
  const zipcode = getField(deal, 'postal_code') || ''

  if (!city && !state && !zipcode) {
    return ''
  }

  return `${city}, ${state} ${zipcode}`
}
