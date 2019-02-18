import React from 'react'
import { BlockPicker } from 'react-color'

import { ItemTitle, ItemContainer } from '../styled'

export default function ColorPicker({ title = 'Font Color', color, onChange }) {
  return (
    <ItemContainer>
      <ItemTitle>{title}</ItemTitle>
      <BlockPicker triangle="hide" color={color} onChangeComplete={onChange} />
    </ItemContainer>
  )
}
