import React, { Component } from 'react'
export default class SelectContainer extends Component {
  render() {
    return (
      <div onKeyUp={this.props.inputChange}>{this.props.children}</div>
    )
  }
}

// PropTypes
SelectContainer.propTypes = {
  inputChange: React.PropTypes.func,
  children: React.PropTypes.object
}