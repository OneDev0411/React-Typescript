import createNumberMask from 'text-mask-addons/dist/createNumberMask'

export const POSITIVE_INTEGER_MASK = createNumberMask({
  prefix: '',
  includeThousandsSeparator: true,
  allowNegative: false,
  allowLeadingZeroes: false,
  allowDecimal: false
})
