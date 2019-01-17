/**
 * a helper that extracts a field from context or proposed values
 */
export function getContext(deal, field) {
  if (!deal) {
    return null
  }

  if (deal.context && deal.context[field]) {
    return deal.context[field]
  }

  return null
}
