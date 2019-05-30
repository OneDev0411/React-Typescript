import React from 'react'

import parseAppearanceString from 'deals/FormEdit/utils/appearance'

import { CheckboxInput } from './styled'

function normalizeCheckboxValue(value) {
  const normalizedValue =
    typeof value === 'string' ? value.trim().toLowerCase() : value

  if (normalizedValue === 'off') {
    return false
  }

  if (normalizedValue === 'on') {
    return true
  }

  return value
}

export default React.memo(props => {
  const { annotation } = props
  const { rect } = annotation

  const appearance = parseAppearanceString(annotation.defaultAppearance)
  const isDefaultChecked = normalizeCheckboxValue(props.defaultValue)

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
      defaultChecked={isDefaultChecked}
    />
  )
})
