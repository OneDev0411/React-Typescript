import { ChangeEvent, useEffect, useState } from 'react'

import { TextField, InputAdornment, TextFieldProps } from '@material-ui/core'
import createNumberMask from 'text-mask-addons/dist/createNumberMask'

import { MaskedInput } from 'components/MaskedInput'

interface Props
  extends Omit<TextFieldProps, 'onChange' | 'value' | 'InputProps'> {
  initialValue?: number
  onChange: (value?: number) => void
}

const priceMask = createNumberMask({
  prefix: '',
  includeThousandsSeparator: true,
  allowNegative: true,
  allowLeadingZeroes: false,
  allowDecimal: false,
  integerLimit: 8
})

export function ListingAdjustmentPriceInput({
  initialValue,
  onChange,
  ...rest
}: Props) {
  const [price, setPrice] = useState<string>(initialValue?.toFixed(0) || '')

  useEffect(() => {
    // TO fix reset input issue on this uncontrolled input
    if (typeof initialValue === 'undefined') {
      setPrice('')
    }
  }, [initialValue])

  const onChangeMaskValue = (e: ChangeEvent<HTMLInputElement>) => {
    const maskedValue = e.target.value

    setPrice(maskedValue)

    // In order to prevent propagating just the negative sign
    // Which cannot be converted into a number
    if (maskedValue !== '-_') {
      onChange(maskedValue ? +maskedValue.replace(/\,/gi, '') : undefined)
    }
  }

  return (
    <TextField
      type="text"
      size="small"
      color="primary"
      value={price}
      InputProps={{
        inputProps: {
          'aria-label': 'Value',
          mask: priceMask
        },
        inputComponent: priceMask ? MaskedInput : undefined,
        startAdornment: <InputAdornment position="start">$</InputAdornment>
      }}
      onChange={onChangeMaskValue}
      variant="outlined"
      {...rest}
    />
  )
}
