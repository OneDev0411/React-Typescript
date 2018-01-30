/**
 * a helper that extracts a field from context or proposed values
 */
export function getContext(deal, field) {
  if (!deal) {
    return null
  }

  const contexts = ['mls_context', 'deal_context']
  const values = {}

  contexts.forEach(ctx => {
    values[ctx] = deal[ctx] && deal[ctx][field] ? deal[ctx][field] : null
  })

  const { mls_context, deal_context } = values

  // mls context has priority over deal context, when there is no deal context
  if (mls_context && !deal_context) {
    return mls_context
  } else if (deal_context) {
    return deal_context
  }

  return null
}

/**
 * a helper that extracts a field from context or proposed values
 */
export function getField(deal, field) {
  const context = getContext(deal, field)

  let value = null

  if (!context) {
    return value
  }

  if (typeof context !== 'object') {
    return context
  }

  if (typeof context === 'object' && context.type === 'deal_context_item') {
    const { context_type } = context

    return context[context_type.toLowerCase()]
  }

  return value
}

/**
 * a helper that extracts address from deal
 */
export function getAddress(deal, roles) {
  if (deal.listing) {
    return deal.mls_context.full_address
  }

  const unitNumber = getField(deal, 'unit_number')
  const city = getField(deal, 'city')
  const state = getField(deal, 'state')
  const postalCode = getField(deal, 'postal_code')

  const address = [
    getField(deal, 'street_number') || '',
    getField(deal, 'street_name') || '',
    getField(deal, 'street_suffix') || '',
    unitNumber ? `, #${unitNumber},` : '',
    city ? `, ${city}` : '',
    state ? `, ${state}` : '',
    postalCode ? `, ${postalCode}` : ''
  ]
    .join(' ')
    .trim()
    .replace(/(\s)+,/gi, ',')
    .replace(/,,/gi, ',')

  if (address.slice('-1') === ',') {
    return address.slice(0, -1)
  }

  if (address.length === 0) {
    return getClientNames(deal, roles)
  }

  return address
}

export function getStatus(deal) {
  return deal.deleted_at ? 'Archived' : getField(deal, 'listing_status')
}

export function getClientNames(deal, roles) {
  const allowedRoles =
    deal.deal_type === 'Buying' ? ['Buyer', 'Tenant'] : ['Seller', 'Landlord']
  const clients = []

  if (!deal.roles || !roles) {
    return ''
  }

  deal.roles.forEach(role => {
    let item = roles[role]

    if (allowedRoles.indexOf(item.role) > -1) {
      if (item.user) {
        clients.push(item.user.display_name)
      } else {
        clients.push(`${item.legal_first_name} ${item.legal_last_name}`)
      }
    }
  })

  return clients.join(', ')
}

/**
 * a helper that formats price
 */
export function getFormattedPrice(number, style = 'currency') {
  if (!number) {
    return number
  }

  return new Intl.NumberFormat('en-US', {
    style,
    currency: 'USD',
    minimumFractionDigits: 2
  }).format(number)
}

/**
 * get deal sise
 */
export function getSide(deal) {
  const sides = {
    Buying: 'Buyer',
    Selling: 'Seller'
  }

  return sides[deal.deal_type]
}

export default {
  side: getSide,
  formattedPrice: getFormattedPrice,
  clientNames: getClientNames,
  status: getStatus,
  address: getAddress,
  field: getField,
  context: getContext
}
