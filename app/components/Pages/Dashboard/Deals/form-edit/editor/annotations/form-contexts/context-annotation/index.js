import React from 'react'

import ToolTip from 'components/tooltip'

import {
  calculateWordWrap,
  getAnnotationsValues
} from '../../../../utils/word-wrap'

import { Container } from './styled'

export default class Context extends React.Component {
  componentDidMount() {
    this.setDefaultValues()
  }

  setDefaultValues = () => {
    if (!this.props.value) {
      return false
    }

    const values = getAnnotationsValues(
      this.props.annotations,
      this.props.value,
      {
        maxFontSize: this.props.maxFontSize
      }
    )

    this.props.onSetValues(values)
  }

  onRef = ref => {
    this.container = ref
  }

  handleClick = () => {
    if (this.props.isReadOnly) {
      return false
    }

    this.props.onClick(this.container.getBoundingClientRect())
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
          <ToolTip
            key={index}
            captionIsHTML
            isCustom={false}
            caption={this.props.tooltip}
            placement="bottom"
            multiline
          >
            <Container
              id={this.props.annotations[index].fieldName}
              fontName={appearance.font}
              fontSize={fontSize}
              bold={appearance.bold}
              color={appearance.color}
              rect={rect}
              ref={this.onRef}
              readOnly={this.props.isReadOnly}
              onClick={this.handleClick}
            >
              {values[index]}
            </Container>
          </ToolTip>
        ))}
      </div>
    )
  }
}
