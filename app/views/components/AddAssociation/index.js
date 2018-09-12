import React from 'react'
import PropTypes from 'prop-types'

export class AddAssociation extends React.Component {
  static propTypes = {
    render: PropTypes.func.isRequired
  }

  state = {
    isActive: false
  }

  handleOpen = () => {
    this.setState({ isActive: true })
  }

  handleClose = () => {
    this.setState({ isActive: false })
  }

  render() {
    return this.props.render({
      handleOpen: this.handleOpen,
      handleClose: this.handleClose,
      isActive: this.state.isActive
    })
  }
}
