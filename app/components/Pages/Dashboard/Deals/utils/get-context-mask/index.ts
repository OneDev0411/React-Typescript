import createNumberMask from 'text-mask-addons/dist/createNumberMask'

import { getFieldProperties } from 'models/Deal/helpers/dynamic-context'

export function getContextInputMask(context: IDealBrandContext) {
  const properties = getFieldProperties(context.key)

  if (properties?.mask) {
    return properties.mask
  }

  if (context.data_type === 'Number' && context.format !== 'Currency') {
    return createNumberMask({
      prefix: '',
      includeThousandsSeparator: false,
      allowNegative: true,
      allowLeadingZeroes: false,
      allowDecimal: false
    })
  }

  if (context.format === 'Currency') {
    return createNumberMask({
      prefix: '',
      allowNegative: false,
      allowLeadingZeroes: true,
      allowDecimal: true
    })
  }

  if (context.data_type === 'Number') {
    return createNumberMask({
      prefix: '',
      allowNegative: true,
      allowLeadingZeroes: false,
      allowDecimal: true
    })
  }

  return null
}
