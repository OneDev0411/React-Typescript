import React from 'react'
import {
  CirclePicker,
  ColorChangeHandler,
  Color,
  ColorState
} from 'react-color'

import { ItemTitle } from '../styled'

import { ColorPickerContainer } from './styled'

interface Props {
  title?: string
  color?: Color
  colors?: string[]
  onChange: ColorChangeHandler<ColorState>
}

export default function ColorPicker({
  title = 'Color',
  color,
  colors,
  onChange
}: Props) {
  return (
    <ColorPickerContainer>
      <ItemTitle>{title}</ItemTitle>
      <CirclePicker
        circleSize={24}
        circleSpacing={11}
        colors={colors}
        color={color}
        onChangeComplete={onChange}
      />
    </ColorPickerContainer>
  )
}
