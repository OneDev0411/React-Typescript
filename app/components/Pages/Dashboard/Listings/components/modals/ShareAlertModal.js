import React from 'react'
import { connect } from 'react-redux'
import compose from 'recompose/compose'
import withState from 'recompose/withState'
import withHandlers from 'recompose/withHandlers'
import { Modal } from 'react-bootstrap'
import Flex from 'styled-flex-component'

import SuccessModal from './SuccessModal'
import { normalizeAlertOptions } from './CreateAlertModal'
import Recipients from '../../../../../Partials/ShareView'
import { hasRecipients } from '../../../../../../utils/helpers'
import { createRoom } from '../../../../../../store_actions/chatroom/room'
import createAlert from '../../../../../../models/listings/alerts/create-alert'

import ActionButton from '../../../../../../views/components/Button/ActionButton'
import IconButton from '../../../../../../views/components/Button/IconButton'
import IconClose from '../../../../../../views/components/SvgIcons/Close/CloseIcon'
import { H2 } from '../../../../../../views/components/Typography/headings'

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
        onHide={isSharing ? () => {} : onHide}
        className="c-share-modal"
      >
        <Flex alignCenter justifyBetween style={{ padding: '1em' }}>
          <H2>Share a search</H2>
          <IconButton
            isFit
            iconSize="large"
            onClick={isSharing ? () => {} : onHide}
          >
            <IconClose />
          </IconButton>
        </Flex>
        <Modal.Body style={{ padding: 0 }}>
          <Recipients onChangeRecipients={recps => setRecipients(recps)} />
        </Modal.Body>
        <Modal.Footer>
          <ActionButton size="small" disabled={disabled} onClick={shareHandler}>
            {isSharing ? 'Save and Sharing...' : 'Save & Share'}
          </ActionButton>
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
