import React from 'react'

import parseAppearanceString from 'deals/FormEdit/utils/appearance'

import { RadioInput } from './styled'

export default React.memo(props => {
  const { annotation } = props
  const appearance = parseAppearanceString(annotation.defaultAppearance)
  const rect = annotation.rect
  const [fieldName, fieldId] = annotation.fieldName.split('.')
  const defaultChecked = props.defaultValue === annotation.buttonValue

  const handleChange = e => {
    const newValues = Object.entries(props.values).reduce((acc, [formName]) => {
      const [fName, fId] = formName.split('.')

      if (fName !== fieldName) {
        return acc
      }

      return {
        ...acc,
        [formName]: fId === fieldId ? e.target.value : ''
      }
    }, {})

    props.onChange(newValues)
  }

  const box = {
    left: rect[0],
    top: rect[1],
    width: Math.floor(rect[2] - rect[0]),
    height: Math.floor(rect[3] - rect[1])
  }

  return (
    <RadioInput
      key={annotation.id}
      name={fieldName}
      appearance={appearance}
      box={box}
      type="radio"
      value={annotation.buttonValue}
      defaultChecked={defaultChecked}
      onChange={handleChange}
    />
  )
})
