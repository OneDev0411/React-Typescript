import { getContext } from 'models/Deal/helpers/context/get-context'

export function isContextApproved(
  deal: IDeal,
  field: IDealBrandContext
): boolean {
  const context: IDealContext = getContext(deal, field.key)

  if (!context || context.source === 'MLS') {
    return true
  }

  return (context && context.approved_at !== null) || !!context.approved_at
}
