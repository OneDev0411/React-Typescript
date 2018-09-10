import React from 'react'
import styled from 'styled-components'

import {
  calculateWordWrap,
  getAnnotationsValues
} from '../../../../utils/word-wrap'

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
  componentDidMount() {
    this.setDefaultValues()
  }

  setDefaultValues = () => {
    const values = getAnnotationsValues(
      this.props.annotations,
      this.props.value,
      {
        maxFontSize: this.props.maxFontSize
      }
    )

    this.props.onSetValues(values)
  }

  render() {
    const { appearance, rects, values, fontSize } = calculateWordWrap(
      this.props.annotations,
      this.props.value,
      {
        maxFontSize: this.props.maxFontSize
      }
    )

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
