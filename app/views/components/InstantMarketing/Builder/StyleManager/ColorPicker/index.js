import React from 'react'
import { CirclePicker } from 'react-color'

import { ItemTitle, ItemContainer } from '../styled'

const ColorPickerContainer = ItemContainer

export default function ColorPicker({ title = 'Font Color', color, onChange }) {
  return (
    <ColorPickerContainer>
      <ItemTitle>{title}</ItemTitle>
      <CirclePicker
        circleSize={38}
        circleSpacing={24}
        color={color}
        onChangeComplete={onChange}
      />
    </ColorPickerContainer>
  )
}
