import { getContext } from '../get-context'

/**
 * a helper that extracts a field from context or proposed values
 */
export function getField(deal, field) {
  const context = getContext(deal, field)

  if (!context) {
    return null
  }

  return context[context.data_type.toLowerCase()]
}
