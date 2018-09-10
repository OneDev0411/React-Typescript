import React from 'react'
import cn from 'classnames'
import parseAppearanceString from '../../appearance'

export default function CheckboxAnnotation(props) {
  const { annotation, value } = props
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
    left: `${box.left}px`,
    top: `${box.top}px`
  }

  return (
    <input
      id={annotation.fieldName}
      type="checkbox"
      key={annotation.fieldName}
      style={style}
      className={cn('checkbox', { focused: props.focused })}
      onChange={e => props.onValueUpdate(e.target.checked)}
      defaultChecked={Boolean(value)}
    />
  )
}
