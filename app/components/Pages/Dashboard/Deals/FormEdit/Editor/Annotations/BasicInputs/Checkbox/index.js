import React from 'react'

import parseAppearanceString from 'deals/FormEdit/utils/appearance'
import { normalizeCheckboxValue } from 'deals/FormEdit/utils/normalize-checkbox-value'

import { CheckboxInput } from './styled'

export default React.memo(props => {
  const { annotation } = props
  const { rect } = annotation

  const appearance = parseAppearanceString(annotation.defaultAppearance)

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
      onClick={e => props.onChange(e.target.checked)}
      defaultChecked={normalizeCheckboxValue(props.defaultValue)}
    />
  )
})
