import React from 'react'

import parseAppearanceString from '../../appearance'

class TextAnnotation extends React.Component {
  shouldComponentUpdate(nextProps) {
    return nextProps.value !== this.props.value
  }

  onChange = e => this.props.onValueUpdate(e.target.value)

  render() {
    const { annotation, value } = this.props
    const appearance = parseAppearanceString(annotation.defaultAppearance)

    const { rect } = annotation

    const style = {
      fontSize: `${this.props.fontSize}px`,
      fontFamily: appearance.font,
      color: appearance.color,
      border: '1px solid #262626',
      borderRadius: '2px',
      fontWeight: appearance.bold ? 'bold' : 'normal',
      position: 'absolute',
      left: rect[0],
      top: rect[1],
      width: Math.floor(rect[2] - rect[0]),
      height: Math.floor(rect[3] - rect[1])
    }

    return (
      <input
        id={annotation.fieldName}
        type="text"
        style={style}
        onInput={this.onChange}
        value={value || ''}
      />
    )
  }
}

export default TextAnnotation
