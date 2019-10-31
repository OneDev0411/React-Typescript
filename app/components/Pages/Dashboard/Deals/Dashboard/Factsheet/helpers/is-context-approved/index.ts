import { getContext } from 'models/Deal/helpers/context/get-context'

import { ContextField } from '../../types'

export function isContextApproved(deal: IDeal, field: ContextField): boolean {
  const context = getContext(deal, field.key)

  if (!context || context.source === 'MLS') {
    return true
  }

  return (context && context.approved_at !== null) || field.approved
}
