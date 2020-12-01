import _ from 'underscore'

import { STATES } from 'utils/address'

export function normalizeAddress(address) {
  const list = {
    city: address.city,
    county: address.county,
    postal_code: address.postal_code,
    state: address.state,
    street_name: address.street_name,
    street_number: address.street_number,
    street_suffix: address.street_suffix,
    unit_number: address.unit_number,
    street_dir_prefix: address.street_prefix,
    state_code: stateToAbbreviated(address.state),
    full_address: [
      address.street_number || '',
      address.street_prefix.value ? address.street_prefix.title : '',
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
      address.street_prefix.value ? address.street_prefix.title : '',
      address.street_name || '',
      address.street_suffix || '',
      address.unit_number ? ` Unit ${address.unit_number}` : ''
    ]
      .join(' ')
      .trim()
  }

  return Object.entries(list).reduce((acc, [field, value]) => {
    if (value == null) {
      return acc
    }

    if (typeof value === 'object' && value.hasOwnProperty('value')) {
      return {
        ...acc,
        [field]: value.value
      }
    }

    return {
      ...acc,
      [field]: value
    }
  }, {})
}

function stateToAbbreviated(stateName) {
  return _.findKey(STATES, name => name === stateName)
}
