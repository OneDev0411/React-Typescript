import React from 'react'

import parseAppearanceString from '../../../../utils/appearance'
import { RadioInput } from './styled'

export default class RadioAnnotation extends React.PureComponent {
  render() {
    const { annotation, value } = this.props
    const appearance = parseAppearanceString(annotation.defaultAppearance)

    const rect = annotation.rect

    const box = {
      left: rect[0],
      top: rect[1],
      width: Math.floor(rect[2] - rect[0]),
      height: Math.floor(rect[3] - rect[1])
    }

    return (
      <RadioInput
        name={annotation.fieldName.split('.')[0]}
        appearance={appearance}
        box={box}
        type="radio"
        key={annotation.id}
        value={annotation.buttonValue}
        defaultChecked={value}
        onChange={e => this.props.onValueUpdate(e.target.value)}
      />
    )
  }
}
