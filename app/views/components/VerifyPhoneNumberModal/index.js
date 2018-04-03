import React, { Component } from 'react'
import { connect } from 'react-redux'
import { addNotification as notify } from 'reapop'

import { Title } from './components/Title'
import { Container } from './components/Container'
import { TextButton } from './components/TextButton'
import { CloseButton } from './components/CloseButton'
import BareModal from '../../../views/components/BareModal'
import ActionButton from '../../../views/components/Button/ActionButton'
import IntercomTriger from '../../../components/Pages/Dashboard/Partials/IntercomTrigger'

import getVerificationCode from '../../../models/verify/request'
import VerifyPhoneNumber from '../../../models/verify/confirm'

const INVALID_CODE_MESSAGE = 'Code is invalid! Please try again.'

const validator = code => new RegExp(/\d{4}$/).exec(code)

const INITIAL_STATE = {
  code: null,
  isVerify: false,
  verifyError: null,
  isReSending: false
}

class VerifyPhoneNumberModal extends Component {
  state = INITIAL_STATE

  canClose = () => {
    const { isVerify, isReSending } = this.state

    if (this.props.unclosable || isVerify || isReSending) {
      return false
    }

    return true
  }

  handleOnClose = () => {
    if (this.canClose()) {
      this.setState(INITIAL_STATE, this.props.handleCloseModal)
    }
  }

  handleOnChangeCode = event => {
    this.setState({ code: event.target.value })
  }

  notify = (status, message, dismissAfter = 4000) =>
    this.props.dispatch(
      notify({
        status,
        message,
        dismissAfter
      })
    )

  handleIntercomTrigger = trigger => {
    if (this.canClose()) {
      this.props.handleCloseModal()
      trigger()
    }
  }

  handleSubmit = async () => {
    const { code } = this.state
    const { user, dispatch } = this.props
    const { phone_number } = user

    if (!code || !phone_number) {
      return
    }

    if (!validator(code)) {
      return this.setState({
        verifyError: INVALID_CODE_MESSAGE
      })
    }

    try {
      this.setState({
        isVerify: true,
        verifyError: null
      })

      const updatedUser = await VerifyPhoneNumber({
        verifyType: 'phone',
        body: {
          code,
          phone_number
        }
      })

      dispatch({
        user: updatedUser,
        type: 'EDIT_USER_SUCCESS'
      })

      this.notify('success', 'Verification complete.')
      this.handleOnClose()
    } catch (errorCode) {
      let verifyError =
        // eslint-disable-next-line
        'Sorry, something went wrong while verifying in our servers. Please try again.'

      if (errorCode === 403) {
        verifyError = INVALID_CODE_MESSAGE
      }

      this.setState({
        verifyError,
        isVerify: false
      })
    }
  }

  handleReSendCode = async () => {
    try {
      this.setState({
        isReSending: true
      })

      await getVerificationCode('phone')

      this.setState(
        {
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
            // eslint-disable-next-line
            'Sorry, something went wrong while sending a new code. Please try again.',
            6000
          )
      )
    }
  }

  render() {
    const { user, isOpen, unclosable } = this.props
    const { isReSending, verifyError, isVerify } = this.state

    return (
      <BareModal
        isOpen={isOpen}
        onRequestClose={this.handleOnClose}
        contentLabel="Verify Phone Number"
        className="c-verify-phone-modal"
      >
        <Container>
          {!unclosable && <CloseButton onClick={this.handleOnClose} />}

          <Title>Please check your phone</Title>

          <p style={{ marginBottom: '24px' }}>
            <span>
              We sent a verification code to the number ending in ******
            </span>
            <b>{user.phone_number.substr(-4, 4)}</b>
            <span>. Enter it below to unlock your full Rechat account.</span>
          </p>

          <div className="c-simple-field">
            <label
              htmlFor="phone-code"
              style={{ cursor: 'pointer', fontWeight: 'normal' }}
            >
              Verification Code
            </label>
            <div style={{ display: 'flex' }}>
              <input
                id="phone-code"
                type="text"
                disabled={isVerify}
                placeholder="Enter Code"
                className="c-simple-field__input"
                onChange={this.handleOnChangeCode}
                style={{ maxWidth: 300 }}
              />
              <ActionButton
                disabled={isVerify || isReSending}
                onClick={this.handleSubmit}
                style={{ marginLeft: '1em' }}
              >
                {isVerify ? 'Sending...' : 'Verify'}
              </ActionButton>
            </div>
            {verifyError && (
              <div
                style={{ maxWidth: 300 }}
                className="c-auth__field__error-alert"
              >
                {verifyError}
              </div>
            )}
          </div>

          <p>
            <span>Didn't receive a code? </span>
            {isReSending ? (
              <span style={{ color: '#2196f3' }}>
                <i className="fa fa-spin fa-spinner" /> Sending...
              </span>
            ) : (
              <TextButton onClick={this.handleReSendCode} disabled={isVerify}>
                Send a new code
              </TextButton>
            )}
          </p>

          {!unclosable && (
            <p>
              <span>Still experiencing issues? </span>
              <IntercomTriger
                render={({ activeIntercom }) => (
                  <TextButton
                    onClick={() => this.handleIntercomTrigger(activeIntercom)}
                  >
                    Contact Support
                  </TextButton>
                )}
              />
            </p>
          )}
        </Container>
      </BareModal>
    )
  }
}

export default connect(({ user }) => ({ user }))(VerifyPhoneNumberModal)
