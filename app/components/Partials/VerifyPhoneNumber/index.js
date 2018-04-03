import React, { Component } from 'react'

import VerifyPhoneNumberModal from '../../../views/components/VerifyPhoneNumberModal'

class VerifyPhoneNumber extends Component {
  state = {
    isOpen: true
  }

  handleOpenModal = () => {
    this.setState({
      isOpen: true
    })
  }

  handleCloseModal = () => {
    this.setState({
      isOpen: false
    })
  }

  render() {
    const { user, unclosable = false } = this.props
    const { isOpen } = this.state

    if (!user.phone_number || user.phone_confirmed) {
      return null
    }

    return (
      <VerifyPhoneNumberModal
        isOpen={isOpen}
        unclosable={unclosable}
        handleCloseModal={this.handleCloseModal}
      />
    )
  }
}

export default VerifyPhoneNumber
