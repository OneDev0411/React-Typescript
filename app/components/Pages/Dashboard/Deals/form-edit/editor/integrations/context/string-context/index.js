import React from 'react'

import { Container } from './styled'

export default class StringContext extends React.Component {
  render() {
    if (!this.props.isOpen) {
      return false
    }

    const position = {
      left: this.props.bounds.left + window.scrollX,
      top: this.props.bounds.top + window.scrollY
    }

    return (
      <Container position={position}>
        <input />
        <button>Save</button>
      </Container>
    )
  }
}
