import React from 'react'
import parseAppearanceString from '../../../../utils/appearance'

import { TextArea, TextInput } from './styled'

class TextAnnotation extends React.PureComponent {
  onChange = e => this.props.onValueUpdate(e.target.value)

  render() {
    const appearance = parseAppearanceString(
      this.props.annotation.defaultAppearance
    )

    const isTextArea = this.props.annotation.multiLine === true
    const defaultValue = this.props.value || ''

    const props = {
      id: this.props.annotation.fieldName,
      appearance,
      fontSize: this.props.fontSize,
      rect: this.props.annotation.rect,
      onInput: this.onChange
    }

    if (isTextArea) {
      return <TextArea {...props} defaultValue={defaultValue} />
    }

    return <TextInput {...props} defaultValue={defaultValue} />
  }
}

export default TextAnnotation
