import React from 'react'
import pure from 'recompose/pure'
import { connect } from 'react-redux'
import compose from 'recompose/compose'
import withState from 'recompose/withState'
import withHandlers from 'recompose/withHandlers'
import { Modal } from 'react-bootstrap'

import SuccessModal from './SuccessModal'
import Recipients from '../../../../../Partials/ShareView'
import { hasRecipients } from '../../../../../../utils/helpers'
import { createRoom } from '../../../../../../store_actions/chatroom/room'
import createRecommendation from '../../../../../../models/recommendation/create-recs'

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
        <Modal.Title className="c-share-modal__title">
          Share Listing
        </Modal.Title>
        <Modal.Body style={{ padding: 0 }}>
          <Recipients onChangeRecipients={recps => setRecipients(recps)} />
        </Modal.Body>
        <Modal.Footer className="c-create-alert-modal__footer">
          <button
            onClick={shareHandler}
            className={`c-create-alert-modal__button ${disabled
              ? 'isSaving'
              : ''}`}
            disabled={disabled}
            style={{ float: 'right' }}
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
  pure,
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
