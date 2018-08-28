import React from 'react'

import parseAppearanceString from './parseAppearanceString'
import cn from 'classnames'


class TextAnnotation extends React.Component {
  constructor(props) {
    super(props)
  }

  shouldComponentUpdate(props) {
    return props.value !== this.props.value
  }

  onValueUpdate(e) {
    const { value } = e.target
    this.props.onValueUpdate(value)
  }

  render() {
    const { annotation, value } = this.props
    const appearance = parseAppearanceString(annotation.defaultAppearance)

    const { rect } = annotation

    const style = {
      fontSize: (this.props.fontSize) + 'px',
      fontFamily: appearance.font,
      color: appearance.color,
      fontWeight: appearance.bold ? 'bold' : 'normal',
      position: 'absolute',
      left: rect[0],
      top: rect[1],
      width: Math.floor(rect[2] - rect[0]),
      height: Math.floor(rect[3] - rect[1]),
    }

    const { multiline } = rect

    return (
      <input
        id={ annotation.fieldName }
        type="text"
        key={ annotation.fieldName }
        style={style}
        onInput={ this.onValueUpdate.bind(this) }
        value={ value || '' }
      />
    )
  }
}


export default TextAnnotation
