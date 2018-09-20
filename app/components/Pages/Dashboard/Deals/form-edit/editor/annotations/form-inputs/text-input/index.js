import React from 'react'
import parseAppearanceString from '../../../../utils/appearance'

import { TextArea, TextInput } from './styled'

class TextAnnotation extends React.Component {
  shouldComponentUpdate(nextProps) {
    return nextProps.value !== this.props.value
  }

  onChange = e => this.props.onValueUpdate(e.target.value)

  render() {
    const appearance = parseAppearanceString(
      this.props.annotation.defaultAppearance
    )

    const isTextArea = this.props.annotation.multiLine === true

    const props = {
      id: this.props.annotation.fieldName,
      appearance,
      fontSize: this.props.fontSize,
      rect: this.props.annotation.rect,
      onInput: this.onChange,
      defaultValue: this.props.value || ''
    }

    if (isTextArea) {
      return <TextArea {...props} />
    }

    return <TextInput {...props} />
  }
}

export default TextAnnotation
