import React from 'react'
import { connect } from 'react-redux'
import { browserHistory } from 'react-router'
import { Modal } from 'react-bootstrap'
import compose from 'recompose/compose'
import withState from 'recompose/withState'
import withHandlers from 'recompose/withHandlers'

import SuccessModal from '../../../../../Dashboard/Listings/components/modals/SuccessModal'
import upgradeToAgent from '../../../../../../../store_actions/user/upgrade-to-agent'
import Button from '../../../../../../../views/components/Button/ActionButton'

const secretQuestionModal = ({
  show,
  onHide,
  // internals
  secret,
  question,
  onChange,
  confirmError,
  isConfirming,
  setConfirmError,
  onConfirmHandler,
  successModalIsActive
}) => (
  <div>
    <Modal
      show={show}
      onHide={isConfirming ? () => {} : onHide}
      className={`c-confirm-modal c-confirm-modal--upgrade ${isConfirming &&
        'is-confirming'}`}
    >
      <Modal.Body>
        <div style={{ marginBottom: '2rem', color: '#000' }}>
          <h2
            style={{ marginBottom: '4rem' }}
            className="c-confirm-modal__title"
          >
            Confirm Your Contact Information
          </h2>
          <p>Enter the complete mobile number or email address below:</p>

          <p>
            Hint: <span style={{ fontWeight: 'bold' }}>{question}</span>
          </p>
        </div>
        <form onSubmit={onConfirmHandler}>
          <div className="c-simple-field">
            <label htmlFor="secret" className="c-simple-field__label" />
            <input
              id="secret"
              type="text"
              onChange={onChange}
              className="c-simple-field__input"
            />
          </div>
          {confirmError && (
            <div className="c-auth__submit-error-alert">
              {confirmError === 401 ? (
                <div>
                  <p>Invalid answer. Agent info is not valid!</p>
                  <button
                    onClick={onHide}
                    className="c-auth__submit-error-alert__btn"
                  >
                    Try with another MLS ID
                  </button>
                </div>
              ) : (
                'An unexpected error occurred. Please try again.'
              )}
            </div>
          )}
          <div style={{ textAlign: 'right' }}>
            <Button
              appearance="outline"
              onClick={() => {
                setConfirmError(false)
                onHide()
              }}
              disabled={isConfirming}
            >
              Cancel
            </Button>

            <Button
              style={{ marginLeft: '1em' }}
              type="submit"
              disabled={isConfirming || !secret}
            >
              {isConfirming ? 'Submitting...' : 'Confirm'}
            </Button>
          </div>
        </form>
      </Modal.Body>
    </Modal>
    <SuccessModal text="Agent Confirmed" isActive={successModalIsActive} />
  </div>
)

export default compose(
  connect(
    null,
    { upgradeToAgent }
  ),
  withState('secret', 'setSecret', false),
  withState('confirmError', 'setConfirmError', false),
  withState('isConfirming', 'setIsConfirming', false),
  withState('successModalIsActive', 'setSuccessModalIsActive', false),
  withHandlers({
    onConfirmHandler: ({
      agent,
      onHide,
      secret,
      redirectTo,
      upgradeToAgent,
      setConfirmError,
      setIsConfirming,
      setSuccessModalIsActive
    }) => async event => {
      event.preventDefault()
      setIsConfirming(true)

      try {
        await upgradeToAgent({ agent, secret })
        setIsConfirming(false)
        onHide()
        setSuccessModalIsActive(true)
        setTimeout(() => {
          setSuccessModalIsActive(false)
          browserHistory.push(redirectTo)
        }, 2000)
      } catch ({ status }) {
        setIsConfirming(false)
        setConfirmError(status)
      }
    }
  }),
  withHandlers({
    onChange: ({ setSecret, setConfirmError, confirmError }) => e => {
      const newValue = e.target.value

      setSecret(newValue)

      if (confirmError && newValue) {
        setConfirmError(false)
      }
    }
  })
)(secretQuestionModal)
