/**
 * a helper that extracts a field from context or proposed values
 */
export function getContext(deal, field, forcedContext = null) {
  if (!deal) {
    return null
  }

  const contexts = ['mls_context', 'deal_context']
  const values = {}

  contexts.forEach(ctx => {
    values[ctx] = deal[ctx] && deal[ctx][field] ? deal[ctx][field] : null
  })

  if (forcedContext) {
    return values[forcedContext]
  }

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
export function getField(deal, field, ctx = null) {
  const context = ctx || getContext(deal, field)

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
 * a helper that returns context discrepencies between deal and mls contexts
 */
export function getContextDiscrepency(deal, field) {
  const dealContext = getContext(deal, field, 'deal_context')

  if (!dealContext) {
    return null
  }

  const dealContextValue = getField(deal, field, dealContext)

  const mlsContext = getContext(deal, field, 'mls_context')
  const mlsContextValue = getField(deal, field, mlsContext)

  return {
    id: dealContext.id,
    name: field,
    hasDiff: mlsContextValue && mlsContextValue !== dealContextValue,
    mls: {
      context: mlsContext,
      value: mlsContextValue
    },
    rechat: {
      context: dealContext,
      value: dealContextValue
    }
  }
}

/**
 * a helper that extracts address from deal
 */
export function getAddress(deal, roles) {
  const address = deal.listing
    ? deal.mls_context.full_address
    : getField(deal, 'full_address')

  if (!address || address.length === 0) {
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
export function getFormattedPrice(
  number,
  style = 'currency',
  minimumFractionDigits = 2
) {
  if (!number) {
    return number
  }

  return new Intl.NumberFormat('en-US', {
    style,
    currency: 'USD',
    minimumFractionDigits
  }).format(number)
}

/**
 * get deal side
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
  context: getContext,
  discrepency: getContextDiscrepency
}
