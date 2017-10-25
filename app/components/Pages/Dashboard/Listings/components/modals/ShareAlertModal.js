import React from 'react'
import pure from 'recompose/pure'
import { connect } from 'react-redux'
import compose from 'recompose/compose'
import withState from 'recompose/withState'
import withHandlers from 'recompose/withHandlers'
import { Modal } from 'react-bootstrap'

import Brand from '../../../../../../controllers/Brand'
import SuccessModal from './SuccessModal'
import { normalizeAlertOptions } from './CreateAlertModal'
import Recipients from '../../../../../Partials/ShareView'
import { hasRecipients } from '../../../../../../utils/helpers'
import { createRoom } from '../../../../../../store_actions/chatroom/room'
import createAlert from '../../../../../../models/listings/alerts/create-alert'

const brandColor = `#${Brand.color('primary', '3388ff')}`

const ShareAlertModal = ({
  onHide,
  isActive,
  // internals
  isSharing,
  recipients,
  shareHandler,
  setRecipients,
  successModalIsActive
}) => {
  const disabled = isSharing || !hasRecipients(recipients)
  return (
    <div>
      <Modal
        show={isActive}
        onHide={isSharing ? () => {
        } : onHide}
        className="c-share-modal"
      >
        <button
          onClick={isSharing ? () => {
          } : onHide}
          className="c-share-modal__close-btn"
        >
          <svg
            fill="#78909C"
            height="16"
            viewBox="0 0 24 24"
            width="16"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"
            />
            <path d="M0 0h24v24H0z" fill="none" />
          </svg>
        </button>
        <Modal.Title className="c-share-modal__title">Share Alert</Modal.Title>
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
            style={{ float: 'right', backgroundColor: !disabled && brandColor }}
          >
            {isSharing ? 'Save and Sharing...' : 'Save & Share'}
          </button>
        </Modal.Footer>
      </Modal>
      <SuccessModal
        type="SAVED_ALERT"
        text="Alert Shared"
        isActive={successModalIsActive}
      />
    </div>
  )
}

export default compose(
  pure,
  connect(
    ({ data, search }) => ({
      user: data.user,
      searchOptions: search.options,
      drawingPoints: search.map.drawing.points
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
      drawingPoints,
      searchOptions,
      setSuccessModalIsActive
    }) => () => {
      setIsSharing(true)

      createRoom(recipients).then(room => {
        const alertOptions = normalizeAlertOptions(
          searchOptions,
          drawingPoints,
          {
            room,
            title: alertTitle,
            created_by: user.id
          }
        )

        createAlert(alertOptions)
          .then(() => {
            setIsSharing(false)
            onHide()
            setSuccessModalIsActive(true)
            setTimeout(() => setSuccessModalIsActive(false), 2000)
          })
          .catch(() => {
            setIsSharing(false)
          })
      })
    }
  })
)(ShareAlertModal)
