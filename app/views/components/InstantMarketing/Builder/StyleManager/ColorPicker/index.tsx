import React from 'react'
import { CirclePicker, ColorChangeHandler, Color } from 'react-color'

import { ItemTitle } from '../styled'

import { ColorPickerContainer } from './styled'

interface Props {
  title?: string
  color?: Color
  colors?: string[]
  onChange: ColorChangeHandler
}

export default function ColorPicker({
  title = 'Font Color',
  color,
  colors,
  onChange
}: Props) {
  return (
    <ColorPickerContainer>
      <ItemTitle>{title}</ItemTitle>
      <CirclePicker
        circleSize={38}
        circleSpacing={24}
        colors={colors}
        color={color}
        onChangeComplete={onChange}
      />
    </ColorPickerContainer>
  )
}
