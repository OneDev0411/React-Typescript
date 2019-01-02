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
  }

  if (deal_context) {
    return deal_context
  }

  return null
}
