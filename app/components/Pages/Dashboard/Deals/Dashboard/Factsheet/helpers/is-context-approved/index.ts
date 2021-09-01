import { getContext } from 'models/Deal/helpers/context/get-context'

export function isContextApproved(
  deal: IDeal,
  field: IDealBrandContext
): boolean {
  const context: Nullable<IDealContext> = getContext(deal, field.key)

  if (!context) {
    return true
  }

  if (deal.listing && field.preffered_source === 'MLS') {
    return true
  }

  return (context && context.approved_at !== null) || !!context.approved_at
}
