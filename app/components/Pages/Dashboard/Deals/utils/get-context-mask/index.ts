import createNumberMask from 'text-mask-addons/dist/createNumberMask'

export function getContextInputMask(context: IDealBrandContext) {
  if (context.properties?.mask) {
    return context.properties.mask
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
