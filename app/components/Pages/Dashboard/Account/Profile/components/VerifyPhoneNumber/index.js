import React, { Component, Fragment } from 'react'
import { connect } from 'react-redux'
import { addNotification as notify } from 'reapop'

import ShadowButton from '../../../../../../../views/components/Button/ShadowButton'
// eslint-disable-next-line
import VerifyPhoneNumberModal from '../../../../../../..//views/components/VerifyPhoneNumberModal'

import getVerificationCode from '../../../../../../../models/verify/request'

const INTERACTIVE_TEXT_COLOR = '#2196f3'

const Button = ShadowButton.extend`
  color: ${INTERACTIVE_TEXT_COLOR};

  &:hover {
    text-decoration: underline;
  }
`

class VerifyPhoneNumber extends Component {
  state = {
    isOpen: false,
    isReSending: false
  }

  notify = (status, message, dismissAfter = 4000) =>
    this.props.notify({
      status,
      message,
      dismissAfter
    })

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

  handleResend = async () => {
    try {
      this.setState({
        isReSending: true
      })

      await getVerificationCode('phone')

      this.setState(
        {
          isOpen: true,
          isReSending: false
        },
        () => this.notify('success', 'The new code texted to your phone.')
      )
    } catch (errorCode) {
      this.setState(
        {
          isReSending: false
        },
        () =>
          this.notify(
            'error',
            'Sorry, something went wrong while sending a new code. Please try again.',
            6000
          )
      )
    }
  }

  render() {
    const { user } = this.props
    const { isReSending, isOpen } = this.state

    if (!user.phone_number || user.phone_confirmed) {
      return null
    }

    return (
      <Fragment>
        <div className="c-auth__submit-error-alert">
          <p>
            The phone number is not verified. We sent a verification code to the
            number.
          </p>
          <p>
            <span>If you have the code, </span>
            <Button onClick={this.handleOpenModal}>submit code</Button>
          </p>
          <p>
            If you didn't receive the code or it is expired,{' '}
            {isReSending ? (
              <span style={{ color: INTERACTIVE_TEXT_COLOR }}>
                <i className="fa fa-spin fa-spinner" /> Sending...
              </span>
            ) : (
              <Button onClick={this.handleResend}>send a new code</Button>
            )}
          </p>
        </div>

        <VerifyPhoneNumberModal
          isOpen={isOpen}
          handleCloseModal={this.handleCloseModal}
        />
      </Fragment>
    )
  }
}

export default connect(({ user }) => ({ user }), { notify })(VerifyPhoneNumber)
