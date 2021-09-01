/**
 * a helper that extracts a field from context or proposed values
 */
export function getContext(deal: IDeal, field: string): Nullable<IDealContext> {
  if (!deal) {
    return null
  }

  if (deal.context && deal.context[field]) {
    return deal.context[field]
  }

  return null
}
