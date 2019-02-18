import React from 'react'
import styled from 'styled-components'
import { SketchPicker } from 'react-color'

import { ItemTitle, ItemContainer } from '../styled'

const ColorPickerContainer = styled(ItemContainer)`
  > div {
    width: 100% !important;
    box-shadow: none !important;
    padding: 0 24px !important;
  }
`

export default function ColorPicker({ title = 'Font Color', color, onChange }) {
  return (
    <ColorPickerContainer>
      <ItemTitle>{title}</ItemTitle>
      <SketchPicker disableAlpha color={color} onChangeComplete={onChange} />
    </ColorPickerContainer>
  )
}
