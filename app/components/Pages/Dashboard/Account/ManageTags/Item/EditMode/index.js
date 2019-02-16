import React, { Component } from 'react'
// import ClickOutside from 'react-click-outside'

import { Container, Input } from './styled'

export default class EditMode extends Component {
  onChange = e => {
    this.props.onChange(e.target.value)
  }

  // handleClickOutside = this.props.toggleMode()

  render() {
    return (
      // <ClickOutside onClickOutside={this.handleClickOutside}>
      <Container>
        <Input value={this.props.value} onChange={this.onChange} />
      </Container>
      // </ClickOutside>
    )
  }
}
