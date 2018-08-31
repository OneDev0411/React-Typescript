import React, { Fragment } from 'react'
import parseAppearanceString from '../../appearance'
import linebreak from '../../linebreak'
import Text from './text'

export default function Context(props) {
  const { annotations, value } = props

  const first = annotations[0]
  const appearance = parseAppearanceString(first.defaultAppearance)

  // TODO: Proper grouping
  const rects = annotations.map(annotation => {
    const rect = annotation.rect

    return {
      left: rect[0],
      top: rect[1],
      width: Math.floor(rect[2] - rect[0]),
      height: Math.floor(rect[3] - rect[1]),
      multiline: annotation.multiLine
    }
  })

  let { values, fontSize } = linebreak(value, rects, appearance.size)

  fontSize = Math.min(fontSize, this.props.maxFontSize || fontSize)

  return (
    <Fragment>
      {rects.map((rect, index) => (
        <Text
          key={index}
          rect={rect}
          text={values[index]}
          fontSize={fontSize}
          fontFamily={appearance.font}
          color={appearance.color}
          bold={appearance.bold}
        />
      ))}
    </Fragment>
  )
}
