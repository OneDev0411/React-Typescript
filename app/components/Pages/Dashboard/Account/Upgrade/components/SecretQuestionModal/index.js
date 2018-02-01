import React from 'react'
import { connect } from 'react-redux'
import { Link, browserHistory } from 'react-router'
import { Modal } from 'react-bootstrap'
import compose from 'recompose/compose'
import withState from 'recompose/withState'
import withHandlers from 'recompose/withHandlers'

import Brand from '../../../../../../../controllers/Brand'
import SuccessModal from '../../../../../Dashboard/Listings/components/modals/SuccessModal'
import upgradeToAgent from '../../../../../../../store_actions/user/upgrade-to-agent'

const brandColor = `#${Brand.color('primary', '3388ff')}`

const secretQuestionModal = ({
  show,
  onHide,
  // internals
  mlsid,
  secret,
  question,
  setSecret,
  redirectTo,
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
        <div style={{ marginBottom: '4rem' }}>
          <h2 style={{ marginBottom: '4rem' }} className="c-confirm-modal__title">
            Confirm Your Contact Information
          </h2>
          <p className="c-confirm-modal__message">
            {`We found the following contact details associated with agent license ${mlsid}.`}
          </p>
          <p style={{ color: '#333', fontSize: '1.8rem', fontWeight: 'bold' }}>
            {question}
          </p>
          <p className="c-confirm-modal__message">
            Answering the question, it might be your email or phone number.
          </p>
        </div>
        <form onSubmit={onConfirmHandler}>
          <div
            style={{ marginBottom: '2rem' }}
            className="c-auth__field__input-wrapper"
          >
            <input
              id="secret"
              type="text"
              onChange={e => {
                const newValue = e.target.value

                setSecret(newValue)

                if (confirmError && newValue) {
                  setConfirmError(false)
                }
              }}
              className={`c-auth__field__input ${secret ? 'has-content' : ''}`}
            />
            <label htmlFor="secret" className="c-auth__field__label">
              Enter the answer:
            </label>
            <span className="focus-border">
              <i />
            </span>
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
          <button
            type="submit"
            className="c-auth__submit-btn"
            disabled={isConfirming || !secret}
            style={{
              background: brandColor,
              opacity: isConfirming || !secret ? 0.7 : 1
            }}
          >
            {isConfirming ? 'Submitting...' : 'Confirm'}
          </button>
        </form>
        <div style={{ textAlign: 'right' }}>
          <button
            onClick={() => {
              setConfirmError(false)
              onHide()
            }}
            disabled={isConfirming}
            style={{ display: 'inline-block' }}
            className="c-auth__submit-error-alert__btn"
          >
            Cancel
          </button>
        </div>
      </Modal.Body>
    </Modal>
    <SuccessModal text="Agent Confirmed" isActive={successModalIsActive} />
  </div>
)

export default compose(
  connect(null, { upgradeToAgent }),
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
      isConfirming,
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
  })
)(secretQuestionModal)
