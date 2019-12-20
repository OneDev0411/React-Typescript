import React, { useState } from 'react'
import { Slider } from '@material-ui/core'

import { ItemTitle, ItemContainer } from '../styled'

const MAX_VALUE = 100
const MIN_VALUE = 2

interface Props {
  title?: string
  value?: string
  onChange: (value: string) => void
}

export default function FontSizePicker({
  title = 'Font Size',
  value = '8px',
  onChange
}: Props) {
  const [innerValue, setInnerValue] = useState<string>(value)
  const fontSizeValue = parseInt(innerValue.replace('px', ''), 10)

  function handleSliderChange(_event: any, newValue: number | number[]) {
    const formattedNewValue = `${
      Array.isArray(newValue) ? newValue[0] : newValue
    }px`

    setInnerValue(formattedNewValue)
    onChange(formattedNewValue)
  }

  return (
    <ItemContainer>
      <ItemTitle>{title}</ItemTitle>
      <Slider
        min={MIN_VALUE}
        max={MAX_VALUE}
        valueLabelDisplay="auto"
        value={fontSizeValue}
        onChange={handleSliderChange}
        aria-labelledby="font-size-slider"
      />
    </ItemContainer>
  )
}
