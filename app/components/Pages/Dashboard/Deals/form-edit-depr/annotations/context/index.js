import React from 'react'
import parseAppearanceString from '../parseAppearanceString'
import linebreak from '../linebreak'
import Text from './text'

class Group extends React.Component {
  render() {
    const { annotations, value } = this.props

    const first = annotations[0]

    const appearance = parseAppearanceString(first.defaultAppearance)

    // TODO: Proper grouping

    const rects = annotations
      .map(annotation => {
        const rect = annotation.rect

        return {
          left: rect[0],
          top: rect[1],
          width: Math.floor(rect[2] - rect[0]),
          height: Math.floor(rect[3] - rect[1]),
          multiline: annotation.multiLine
        }
      })

    let {values, fontSize} = linebreak(value, rects, appearance.size)
    fontSize = Math.min(fontSize, this.props.maxFontSize || fontSize)

    const containers = []
    rects.forEach((rect, i) => {
      containers.push((
        <Text
          key={ i }
          rect={ rect }
          text={ values[i] }
          fontSize = { fontSize }
          fontFamily = { appearance.font }
          color = { appearance.color }
          bold = { appearance.bold }
        />
      ))
    })

    return (
      <div>
        { containers }
      </div>
    )
  }
}

export default Group