import React, { useState } from 'react'
import { Slider } from '@material-ui/core'

import { ItemTitle, ItemContainer } from '../styled'

const MAX_VALUE = 550
const MIN_VALUE = 0
const STEP_VALUE = 50

interface Props {
  title?: string
  value?: string
  onChange: (value: string) => void
}

export default function WidthPicker({
  title = 'Width',
  value = '0px',
  onChange
}: Props) {
  const [innerValue, setInnerValue] = useState<string>(value)
  const widthValue = parseInt(innerValue.replace('px', ''), 10) || 0

  function handleSliderChange(_event: any, newValue: number | number[]) {
    const rawNewValue = Array.isArray(newValue) ? newValue[0] : newValue

    const formattedNewValue = rawNewValue > 0 ? `${rawNewValue}px` : 'auto'

    setInnerValue(formattedNewValue)
    onChange(formattedNewValue)
  }

  return (
    <ItemContainer>
      <ItemTitle>{title}</ItemTitle>
      <Slider
        valueLabelFormat={value => (value === 0 ? 'auto' : value)}
        step={STEP_VALUE}
        min={MIN_VALUE}
        max={MAX_VALUE}
        valueLabelDisplay="auto"
        value={widthValue}
        onChange={handleSliderChange}
        aria-labelledby="width-slider"
      />
    </ItemContainer>
  )
}
