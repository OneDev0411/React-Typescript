import React from 'react'
import cn from 'classnames'

import parseAppearanceString from '../../../../utils/appearance'

export default class RadioAnnotation extends React.PureComponent {
  render() {
    const { annotation } = this.props
    const appearance = parseAppearanceString(annotation.defaultAppearance)

    const rect = annotation.rect

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
      transform: 'scale(2)',
      transformOrigin: 'center',
      lineHeight: 0.5,
      textAlign: 'center',
      left: `${box.left}px`,
      top: `${box.top}px`
    }

    return (
      <input
        type="radio"
        key={annotation.id}
        style={style}
        className={cn('radio', { focused: this.props.focused })}
        onChange={e => this.props.onValueUpdate(e.target.value)}
      />
    )
  }
}
