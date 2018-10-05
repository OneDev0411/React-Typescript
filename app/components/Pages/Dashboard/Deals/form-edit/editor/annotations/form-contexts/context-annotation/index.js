import React from 'react'

import {
  calculateWordWrap,
  getAnnotationsValues
} from '../../../../utils/word-wrap'

import { getValue } from '../../../../utils/types'

import ToolTip from './tooltip'

import { Container } from './styled'

export default class Context extends React.Component {
  componentDidMount() {
    this.setDefaultValues()
  }

  setDefaultValues = () => {
    if (this.props.value) {
      const values = getAnnotationsValues(
        this.props.annotations,
        this.props.value,
        {
          maxFontSize: this.props.maxFontSize
        }
      )

      this.props.onSetValues(values)
      return
    }

    const values = {}

    this.props.annotations.forEach(annotation => {
      values[annotation.fieldName] = getValue(annotation)
    })

    this.props.onSetValues(values)
  }

  get HasMlsLock() {
    if (this.props.isAddressField && this.props.isDealConnectedToMls) {
      return true
    }

    return false
  }

  render() {
    const { appearance, rects, values, fontSize } = calculateWordWrap(
      this.props.annotations,
      this.props.value,
      {
        maxFontSize: this.props.maxFontSize
      }
    )

    const hasMlsLock = this.HasMlsLock
    const isReadOnly = this.props.isReadOnly || hasMlsLock

    return (
      <div>
        {rects.map((rect, index) => (
          <ToolTip key={index} hasMlsLock={hasMlsLock}>
            <Container
              fontName={appearance.font}
              fontSize={fontSize}
              bold={appearance.bold}
              color={appearance.color}
              rect={rect}
              innerRef={ref => (this.container = ref)}
              readOnly={isReadOnly}
              onClick={() =>
                !isReadOnly &&
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
