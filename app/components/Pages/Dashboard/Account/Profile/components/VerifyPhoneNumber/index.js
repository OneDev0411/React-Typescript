import React, { Component, Fragment } from 'react'

import { Box } from '@material-ui/core'
import { connect } from 'react-redux'
import styled from 'styled-components'

import { addNotification as notify } from 'components/notification'
import CircleSpinner from 'components/SvgIcons/CircleSpinner/IconCircleSpinner'

// eslint-disable-next-line
import VerifyPhoneNumberModal from '../../../../../../..//views/components/VerifyPhoneNumberModal'

import getVerificationCode from '../../../../../../../models/verify/request'
import ActionButton from '../../../../../../../views/components/Button/ActionButton'

const Button = styled(ActionButton)`
  padding: 0;
  vertical-align: initial;
`

class VerifyPhoneNumber extends Component {
  constructor(props) {
    super(props)

    this.needConfirm = this.needConfirm.bind(this)

    this.state = {
      isReSending: false,
      isOpen: this.needConfirm(this.props.user)
    }
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    if (!this.state.isOpen && this.needConfirm(nextProps.user)) {
      this.setState({
        isOpen: true
      })
    }
  }

  needConfirm = user => user.phone_number && !user.phone_confirmed

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
            // eslint-disable-next-line max-len
            'Sorry, something went wrong while sending a new code. Please try again.',
            6000
          )
      )
    }
  }

  render() {
    const { user } = this.props
    const { isReSending, isOpen } = this.state

    if (!this.needConfirm(user)) {
      return null
    }

    return (
      <Fragment>
        <div className="c-auth__submit-alert--success">
          <p>
            We sent a verification code to your mobile number.{' '}
            <Button appearance="link" onClick={this.handleOpenModal}>
              Submit the code
            </Button>
          </p>
          <Box display="flex" alignItems="center">
            <Box mr={0.5}>Didn't receive a code? </Box>
            {isReSending ? (
              <Box color="primary.main" display="flex" alignItems="center">
                <CircleSpinner style={{ width: '24px', height: '24px' }} />{' '}
                Sending...
              </Box>
            ) : (
              <Button appearance="link" onClick={this.handleResend}>
                Send a new code
              </Button>
            )}
          </Box>
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
