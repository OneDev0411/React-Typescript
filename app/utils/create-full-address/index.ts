export interface PostgresAddress {
  street_number?: string
  street_prefix?: string
  street_name?: string
  street_suffix?: string
  unit_number?: string
  city?: string
  state?: string
  postal_code?: string
}

/**
 * gets parts of a standard address and returns the full address
 *
 * @param address the standard address
 * @returns the calculated full address
 *
 * example: 1200 SW Louisiana St, Unit 111, Houston, TX, 77002
 */
export function createFullAddress(address: PostgresAddress): string {
  return [
    address.street_number || '',
    address.street_prefix ? address.street_prefix.trim() : '',
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
    .replace(/,,/gi, ',')
}
