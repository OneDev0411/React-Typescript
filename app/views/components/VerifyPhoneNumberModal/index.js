import React, { Component } from 'react'
import styled from 'styled-components'
import { connect } from 'react-redux'
import { addNotification as notify } from 'reapop'

import getVerificationCode from '../../../models/verify/request'
import VerifyPhoneNumber from '../../../models/verify/confirm'

import BareModal from '../BareModal'
import ActionButton from '../Button/ActionButton'
import { primary } from '../../utils/colors'
import IntercomTriger from '../IntercomTrigger'

import { Title } from './components/Title'
import { Container } from './components/Container'
import { CloseButton } from './components/CloseButton'

const LinkButton = styled(ActionButton)`
  padding: 0;
  height: auto;
  line-height: 1;
  vertical-align: initial;
`

const INVALID_CODE_MESSAGE = 'Code is invalid! Please try again.'

const onChangeValidator = code => new RegExp(/\d/).exec(code)
const submitValidator = code => new RegExp(/\d{4}$/).exec(code)

const INITIAL_STATE = {
  code: '',
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

  handleOnChangeCode = ({ target }) => {
    const { value: code } = target

    if (!code && this.state.code.length > 0) {
      this.setState({ code: '' })
    }

    if (onChangeValidator(code) && code.length <= 4) {
      this.setState({ code })
    }
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

    if (!submitValidator(code)) {
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
        () =>
          this.notify(
            'success',
            'A new 4-digit code has been texted to your mobile number.'
          )
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
    const { code, isReSending, verifyError, isVerify } = this.state

    return (
      <BareModal
        isOpen={isOpen}
        onRequestClose={this.handleOnClose}
        contentLabel="Verify Phone Number"
        className="c-verify-phone-modal"
      >
        <Container>
          {!unclosable && <CloseButton onClick={this.handleOnClose} />}

          <Title>Please check your mobile phone</Title>

          <p style={{ marginBottom: '1.5em' }}>
            <span>We sent a verification code to the number </span>
            <b>
              {!unclosable
                ? user.phone_number
                : `ending in ******${user.phone_number.substr(-4, 4)}`}
            </b>
            <span>
              . Enter it below to unlock your full Rechat account in your mobile
              phone.
            </span>
          </p>

          <div className="c-simple-field">
            <div style={{ cursor: 'pointer', fontWeight: 'normal' }}>
              4-Digit Verification Code
            </div>
            <div style={{ display: 'flex' }}>
              <input
                id="phone-code"
                type="text"
                value={code}
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
              <span style={{ color: primary }}>
                <i className="fa fa-spin fa-spinner" /> Sending...
              </span>
            ) : (
              <LinkButton
                appearance="link"
                onClick={this.handleReSendCode}
                disabled={isVerify}
              >
                Send a new code
              </LinkButton>
            )}
          </p>

          {!unclosable && (
            <p>
              <span>Still experiencing issues? </span>
              <IntercomTriger
                render={({ activeIntercom }) => (
                  <LinkButton
                    appearance="link"
                    onClick={() => this.handleIntercomTrigger(activeIntercom)}
                  >
                    Contact Support
                  </LinkButton>
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
