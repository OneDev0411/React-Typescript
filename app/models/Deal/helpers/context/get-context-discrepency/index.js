import { getContext } from '../get-context'
import { getField } from '../get-field'

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
