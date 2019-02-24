import React from 'react'

import ToolTip from 'components/tooltip'

import { calculateWordWrap } from '../../../../utils/word-wrap'

import { Container } from './styled'

export default class Context extends React.Component {
  constructor(props) {
    super(props)
    this.container = React.createRef()
  }

  handleClick = () => {
    if (this.props.isReadOnly) {
      return false
    }

    this.props.onClick(this.container.current.getBoundingClientRect())
  }

  get Calculate() {
    return calculateWordWrap(this.props.annotations, this.props.value, {
      maxFontSize: this.props.maxFontSize
    })
  }

  render() {
    const { appearance, rects, values, fontSize } = this.Calculate

    return (
      <React.Fragment>
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
              ref={this.container}
              readOnly={this.props.isReadOnly}
              onClick={this.handleClick}
            >
              {values[index]}
            </Container>
          </ToolTip>
        ))}
      </React.Fragment>
    )
  }
}
