import React from 'react'

import parseAppearanceString from '../../../../utils/appearance'
import { CheckboxInput } from './styled'

export default function CheckboxAnnotation(props) {
  const { annotation, value } = props
  const appearance = parseAppearanceString(annotation.defaultAppearance)

  const { rect } = annotation

  const box = {
    left: rect[0],
    top: rect[1],
    width: Math.floor(rect[2] - rect[0]),
    height: Math.floor(rect[3] - rect[1])
  }

  return (
    <CheckboxInput
      type="checkbox"
      id={annotation.fieldName}
      box={box}
      appearance={appearance}
      key={annotation.fieldName}
      onChange={e => props.onValueUpdate(e.target.checked)}
      defaultChecked={Boolean(value)}
    />
  )
}
