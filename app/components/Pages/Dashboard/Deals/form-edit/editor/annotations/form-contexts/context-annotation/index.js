import React from 'react'

import {
  calculateWordWrap,
  getAnnotationsValues
} from '../../../../utils/word-wrap'

import { Container } from './styled'

import ToolTip from 'components/tooltip'

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

  get ToolTipCaption() {
    const { annotationContext } = this.props

    const data = [`Type: ${annotationContext.type}`]

    if (annotationContext.role) {
      data.push(`Roles: ${annotationContext.role.join(' and ')}`)
    }

    if (annotationContext.attribute) {
      data.push(`Attribute: ${annotationContext.attribute}`)
    }

    if (annotationContext.number !== undefined) {
      data.push(`Number: ${annotationContext.number}`)
    }

    if (annotationContext.order !== undefined) {
      data.push(`Order: ${annotationContext.order}`)
    }

    if (annotationContext.type === 'Context') {
      annotationContext.context.priority &&
        data.push(`Priority: ${annotationContext.context.priority}`)

      data.push(`Name: ${annotationContext.context.name}`)
      data.push(`Data Type: ${annotationContext.context.data_type}`)
    }

    return data.join('<br />')
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
            placement="bottom"
            caption={this.ToolTipCaption}
            multiline
          >
            <Container
              fontName={appearance.font}
              fontSize={fontSize}
              bold={appearance.bold}
              color={appearance.color}
              rect={rect}
              innerRef={ref => (this.container = ref)}
              readOnly={this.props.isReadOnly}
              onClick={() =>
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
