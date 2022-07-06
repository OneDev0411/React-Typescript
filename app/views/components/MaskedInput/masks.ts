import type { Mask } from 'react-text-mask'
import createNumberMask from 'text-mask-addons/dist/createNumberMask'

export const POSITIVE_INTEGER_MASK = createNumberMask({
  prefix: '',
  includeThousandsSeparator: true,
  allowNegative: false,
  allowLeadingZeroes: false,
  allowDecimal: false
})

export const PHONE_NUMBER_MASK: Mask = [
  '(',
  /[1-9]/,
  /\d/,
  /\d/,
  ')',
  ' ',
  /\d/,
  /\d/,
  /\d/,
  '-',
  /\d/,
  /\d/,
  /\d/,
  /\d/
]
