import React, { Fragment } from 'react'
import styled from 'styled-components'

import parseAppearanceString from '../../appearance'
import linebreak from '../../linebreak'

const Container = styled.div`
  font-size: ${props => props.fontSize};
  font-family: ${props => props.fontName};
  color: ${props => props.color};
  font-weight: ${props => (props.bold ? 'bold' : 'normal')};
  position: absolute;
  left: ${props => props.rect.left}px;
  top: ${props => props.rect.top}px;
  width: ${props => props.rect.width}px;
  height: ${props => props.rect.height}px;
  border: 1px dotted green;
  cursor: pointer;

  :hover {
    background-color: rgba(0, 0, 0, 0.1);
  }
`

export default class Context extends React.Component {
  render() {
    const { annotations, value } = this.props

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
      <div>
        {rects.map((rect, index) => (
          <Container
            key={index}
            fontName={appearance.font}
            fontSize={fontSize}
            bold={appearance.bold}
            color={appearance.color}
            rect={rect}
            innerRef={ref => (this.container = ref)}
            onClick={() =>
              this.props.onClick(this.container.getBoundingClientRect())
            }
          >
            {values[index]}
          </Container>
        ))}
      </div>
    )
  }
}
