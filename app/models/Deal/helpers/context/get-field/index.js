import { getContext } from '../get-context'

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

  if (context.type === 'mls_context') {
    return context[field]
  }

  if (typeof context === 'object' && context.type === 'deal_context_item') {
    const { context_type } = context

    return context[context_type.toLowerCase()]
  }

  return value
}
