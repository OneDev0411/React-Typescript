import React, { Component } from 'react'
import PropTypes from 'prop-types'

import AddButton from './components/AddButton'

class AddAssociations extends Component {
  state = {
    isOpen: false
  }

  handleOpen = () => {
    this.setState({ isOpen: true })
  }

  handleClose = () => {
    this.setState({ isOpen: false })
  }

  render() {
    const { isOpen } = this.state
    const { title, render } = this.props

    return (
      <div>
        <AddButton title={title} onClick={this.handleOpen} />
        {render({ isOpen, handleClose: this.handleClose })}
      </div>
    )
  }
}

AddAssociations.propTypes = {
  render: PropTypes.func.isRequired,
  title: PropTypes.string.isRequired
}

export default AddAssociations
