import React, { useState } from 'react'
import { Slider } from '@material-ui/core'

import { ItemTitle, ItemContainer } from '../styled'

const MIN_VALUE = 0
const MAX_VALUE = 100
const STEP_VALUE = 5

interface Padding {
  top: string
  bottom: string
}

interface Props {
  title?: string
  value?: Padding
  onChange: (value: Padding) => void
}

export default function PaddingPicker({
  title = 'Padding',
  value = {
    top: '0px',
    bottom: '0px'
  },
  onChange
}: Props) {
  const [innerValue, setInnerValue] = useState<Padding>(value)
  const topValue = parseInt(innerValue.top.replace('px', ''), 10) || 0
  const bottomValue = parseInt(innerValue.bottom.replace('px', ''), 10) || 0

  function onValueChange(direction: keyof Padding, newValue: number) {
    const formattedNewValue = `${newValue}px`

    const newInnerValue = {
      ...innerValue,
      [direction]: formattedNewValue
    }

    setInnerValue(newInnerValue)
    onChange(newInnerValue)
  }

  return (
    <ItemContainer>
      <ItemTitle>Top {title}</ItemTitle>
      <Slider
        min={MIN_VALUE}
        max={MAX_VALUE}
        step={STEP_VALUE}
        valueLabelDisplay="auto"
        value={topValue}
        onChange={(_e: React.ChangeEvent<{}>, newValue) => {
          const valueNumber = Array.isArray(newValue) ? newValue[0] : newValue

          onValueChange('top', valueNumber)
        }}
        aria-labelledby="padding-top-slider"
      />
      <ItemTitle>Bottom {title}</ItemTitle>
      <Slider
        min={MIN_VALUE}
        max={MAX_VALUE}
        step={STEP_VALUE}
        valueLabelDisplay="auto"
        value={bottomValue}
        onChange={(_e: React.ChangeEvent<{}>, newValue) => {
          const valueNumber = Array.isArray(newValue) ? newValue[0] : newValue

          onValueChange('bottom', valueNumber)
        }}
        aria-labelledby="padding-bottom-slider"
      />
    </ItemContainer>
  )
}
