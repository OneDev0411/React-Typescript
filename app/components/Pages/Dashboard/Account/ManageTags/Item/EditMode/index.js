import React, { Component } from 'react'

import { Container, Input } from './styled'

export class EditMode extends Component {
  onChange = e => {
    this.props.onChange(e.target.value)
  }

  render() {
    return (
      <Container>
        <Input value={this.props.value} onChange={this.onChange} />
      </Container>
    )
  }
}
