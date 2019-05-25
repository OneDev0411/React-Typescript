import { stateToAbbreviated } from 'deals/utils/address'

export function normalizeAddress(address) {
  return {
    ...address,
    street_dir_prefix: address.street_prefix,
    state_code: stateToAbbreviated(address.state),
    full_address: [
      address.street_number || '',
      address.street_name || '',
      address.street_suffix || '',
      address.unit_number ? `, Unit ${address.unit_number},` : '',
      address.city ? `, ${address.city}` : '',
      address.state ? `, ${address.state}` : '',
      address.postal_code ? `, ${address.postal_code}` : ''
    ]
      .join(' ')
      .trim()
      .replace(/(\s)+,/gi, ',')
      .replace(/,,/gi, ','),
    street_address: [
      address.street_number || '',
      address.street_name || '',
      address.street_suffix || '',
      address.unit_number ? ` Unit ${address.unit_number}` : ''
    ]
      .join(' ')
      .trim()
  }
}
