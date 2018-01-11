import React from 'react'
import { connect } from 'react-redux'
import compose from 'recompose/compose'
import withState from 'recompose/withState'
import withHandlers from 'recompose/withHandlers'
import { Modal } from 'react-bootstrap'

import Brand from '../../../../../../controllers/Brand'
import SuccessModal from './SuccessModal'
import Recipients from '../../../../../Partials/ShareView'
import { hasRecipients } from '../../../../../../utils/helpers'
import { createRoom } from '../../../../../../store_actions/chatroom/room'
import createRecommendation from '../../../../../../models/recommendation/create-recs'

const brandColor = `#${Brand.color('primary', '3388ff')}`

const ShareListingModal = ({
  onHide,
  isActive,
  // internals
  isSharing,
  recipients,
  shareHandler,
  setRecipients,
  onChangeRecipients,
  successModalIsActive
}) => {
  const disabled = isSharing || !hasRecipients(recipients)

  return (
    <div>
      <Modal
        show={isActive}
        onHide={isSharing ? () => {} : onHide}
        className="c-share-modal"
      >
        <button
          onClick={isSharing ? () => {} : onHide}
          className="c-share-modal__close-btn"
        >
          <svg
            fill="#78909C"
            height="16"
            viewBox="0 0 24 24"
            width="16"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z" />
            <path d="M0 0h24v24H0z" fill="none" />
          </svg>
        </button>
        <Modal.Title className="c-share-modal__title">Share Listing</Modal.Title>
        <Modal.Body style={{ padding: 0 }}>
          <Recipients onChangeRecipients={recps => setRecipients(recps)} />
        </Modal.Body>
        <Modal.Footer className="c-create-alert-modal__footer">
          <button
            onClick={shareHandler}
            className={`c-create-alert-modal__button ${disabled ? 'isSaving' : ''}`}
            disabled={disabled}
            style={{ float: 'right', backgroundColor: !disabled && brandColor }}
          >
            {isSharing ? 'Sharing...' : 'Share'}
          </button>
        </Modal.Footer>
      </Modal>
      <SuccessModal text="Listing Shared" isActive={successModalIsActive} />
    </div>
  )
}

export default compose(
  connect(null, { createRoom }),
  withState('recipients', 'setRecipients', {}),
  withState('isSharing', 'setIsSharing', false),
  withState('successModalIsActive', 'setSuccessModalIsActive', false),
  withHandlers({
    shareHandler: ({
      user,
      onHide,
      listing,
      isSharing,
      recipients,
      alertTitle,
      createRoom,
      setIsSharing,
      setSuccessModalIsActive
    }) => () => {
      const { mls_number } = listing
      const notification = true

      setIsSharing(true)

      createRoom(recipients).then(room => {
        createRecommendation({ room, mls_number, notification })
          .then(recsId => {
            setIsSharing(false)

            if (recsId) {
              onHide()
              setSuccessModalIsActive(true)
              setTimeout(() => setSuccessModalIsActive(false), 2000)
            }
          })
          .catch(({ message }) => {
            setIsSharing(false)
          })
      })
    }
  })
)(ShareListingModal)
