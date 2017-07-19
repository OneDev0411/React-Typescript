import React from 'react'
import pure from 'recompose/pure'
import { connect } from 'react-redux'
import compose from 'recompose/compose'
import withState from 'recompose/withState'
import withHandlers from 'recompose/withHandlers'
import { Modal } from 'react-bootstrap'

import SuccessModal from './SuccessModal'
import Compose from '../../../../../Partials/Compose'
import { hasRecipients } from '../../../../../../utils/helpers'
import { createRoom } from '../../../../../../store_actions/chatroom/room'
import createAlert from '../../../../../../models/listings/alerts/create-alert'

const ShareAlertModal = ({
  onHide,
  isActive,
  // internals
  isSharing,
  recipients,
  shareHandler,
  setRecipients,
  onChangeRecipients,
  successModalIsActive
}) =>
  <div>
    <Modal
      show={isActive}
      onHide={isSharing ? () => {} : onHide}
      className="c-share-modal"
    >
      <Modal.Title className="c-share-modal__title">Share Alert</Modal.Title>
      <Modal.Body style={{ padding: 0 }}>
        <Compose onChangeRecipients={recps => setRecipients(recps)} />
      </Modal.Body>
      <Modal.Footer className="c-create-alert-modal__footer">
        <button
          onClick={shareHandler}
          className={`c-create-alert-modal__button ${isSharing
            ? 'isSaving'
            : ''}`}
          disabled={isSharing || !hasRecipients(recipients)}
          style={{ float: 'right' }}
        >
          Save &amp; Share
        </button>
      </Modal.Footer>
    </Modal>
    <SuccessModal
      type="SAVED_ALERT"
      text="Alert Shared"
      isActive={successModalIsActive}
    />
  </div>

export default compose(
  pure,
  connect(
    ({ data, search }) => ({
      user: data.user,
      searchOptions: search.options
    }),
    { createRoom }
  ),
  withState('recipients', 'setRecipients', {}),
  withState('isSharing', 'setIsSharing', false),
  withState('successModalIsActive', 'setSuccessModalIsActive', false),
  withHandlers({
    shareHandler: ({
      user,
      onHide,
      isSharing,
      recipients,
      alertTitle,
      createRoom,
      setIsSharing,
      searchOptions,
      setSuccessModalIsActive
    }) => () => {
      setIsSharing(true)

      createRoom(recipients).then(room => {
        const alertOptions = {
          ...searchOptions,
          room,
          limit: null,
          title: alertTitle,
          created_by: user.id
        }

        createAlert(alertOptions)
          .then(alert => {
            setIsSharing(false)
            onHide()
            setSuccessModalIsActive(true)
            setTimeout(() => setSuccessModalIsActive(false), 2000)
          })
          .catch(({ message }) => {
            setIsSharing(false)
          })
      })
    }
  })
)(ShareAlertModal)
