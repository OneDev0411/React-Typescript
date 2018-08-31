import React from 'react'
import cn from 'classnames'
import parseAppearanceString from './parseAppearanceString'
import PDFJS from 'pdfjs-dist';

class CheckboxAnnotation extends React.Component {
  constructor(props) {
    super(props)
  }

  onValueUpdate(e) {
    const { checked } = e.target

    this.props.onValueUpdate(checked)
  }

  render() {
    const { annotation, value } = this.props
    const appearance = parseAppearanceString(annotation.defaultAppearance)

    const { rect } = annotation

    const box = {
      left: rect[0],
      top: rect[1],
      width: Math.floor(rect[2] - rect[0]),
      height: Math.floor(rect[3] - rect[1])
    }

    const style = {
      color: appearance.color,
      fontWeight: appearance.bold ? 'bold' : 'normal',
      fontFace: appearance.fontFace,
      position: 'absolute',
      textAlign: 'center',
      left: box.left + 'px',
      top: box.top + 'px',
    }

    const focused = this.props.focused

    return (
      <input
        id={ annotation.fieldName }
        type="checkbox"
        key={ annotation.fieldName }
        style={style}
        className={ cn('checkbox', { focused }) }
        onChange={ this.onValueUpdate.bind(this) }
        checked={ Boolean(value) }
      />
    )
  }
}

export default CheckboxAnnotation