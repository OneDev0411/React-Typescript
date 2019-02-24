import React from 'react'

import { Container } from './styled'

export class ContextInlineEdit extends React.Component {
  position = null

  get Position() {
    if (this.position) {
      return this.position
    }

    // get bounds
    const { bounds } = this.props.item.data

    const position = {
      left: bounds.left + window.scrollX,
      top: bounds.top + window.scrollY
    }

    this.position = position

    return this.position
  }

  render() {
    if (!this.props.item) {
      return false
    }

    return <Container position={this.Position}>+++</Container>
  }
}
