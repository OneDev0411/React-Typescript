import { getFormattedPrice } from '../../context'

export function getFormattedValue(context: IDealBrandContext, value: unknown) {
  if (!value) {
    return value
  }

  if (context.format === 'Currency') {
    return getFormattedPrice(parseFloat(value as string), 'currency', 0)
  }

  return value
}
