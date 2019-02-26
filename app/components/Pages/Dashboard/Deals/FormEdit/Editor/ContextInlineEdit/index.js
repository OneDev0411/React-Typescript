import React from 'react'
import ClickOutside from 'react-click-outside'

import { Container } from './styled'

export class ContextInlineEdit extends React.Component {
  position = null

  get Position() {
    if (this.position) {
      return this.position
    }

    // get bounds
    const { bounds } = this.props.item.data

    console.log(bounds)

    const position = {
      left: bounds.left + window.scrollX,
      top: bounds.top + window.scrollY,
      width: Math.max(200, bounds.right - bounds.left)
    }

    this.position = position

    return position
  }

  render() {
    console.log(this.props)

    return (
      <ClickOutside onClickOutside={this.props.onDismiss}>
        <Container position={this.Position}>+++</Container>
      </ClickOutside>
    )
  }
}
