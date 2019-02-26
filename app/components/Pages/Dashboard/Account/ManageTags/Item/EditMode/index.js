import React, { Component } from 'react'

import { Container, Input, InputPlaceholder } from './styled'
import { LoadingIcon } from '../styled'

export class EditMode extends Component {
  onChange = e => {
    this.props.onChange(e.target.value)
  }

  render() {
    const { value, loading } = this.props

    return (
      <Container>
        {loading && <LoadingIcon />}
        <Input disabled={loading} value={value} onChange={this.onChange} />
        <InputPlaceholder>{value}</InputPlaceholder>
      </Container>
    )
  }
}
