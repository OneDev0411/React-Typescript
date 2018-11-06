import React from 'react'

import {
  calculateWordWrap,
  getAnnotationsValues
} from '../../../../utils/word-wrap'

import ToolTip from 'components/tooltip'

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
              ref={ref => (this.container = ref)}
              readOnly={this.props.isReadOnly}
              onClick={() =>
                !this.props.isReadOnly &&
                this.props.onClick(this.container.getBoundingClientRect())
              }
            >
              {values[index]}
            </Container>
          </ToolTip>
        ))}
      </div>
    )
  }
}
