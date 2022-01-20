import React from 'react'

import { IconButton } from '@material-ui/core'
import { mdiClose } from '@mdi/js'
import { connect } from 'react-redux'
import compose from 'recompose/compose'
import withHandlers from 'recompose/withHandlers'
import withState from 'recompose/withState'
import Flex from 'styled-flex-component'

import Chatroom from '@app/components/Pages/Dashboard/Chatroom/Util/chatroom'
import { createRoom } from '@app/store_actions/chatroom/room'
import createAlert from '@app/store_actions/listings/alerts/create-alert'
import { hasRecipients } from '@app/utils/helpers'
import ActionButton from '@app/views/components/Button/ActionButton'
import { Modal, ModalFooter } from '@app/views/components/Modal'
import { SvgIcon } from '@app/views/components/SvgIcons/SvgIcon'
import { H2 } from '@app/views/components/Typography/headings'

import Recipients from '../../../../../Partials/ShareView'

import { normalizeAlertOptions } from './normalize-alert-options'
import SuccessModal from './SuccessModal'

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
        isOpen={isActive}
        autoHeight
        onRequestClose={isSharing ? () => {} : onHide}
        className="c-share-modal"
      >
        <Flex alignCenter justifyBetween style={{ padding: '1em' }}>
          <H2>Share a search</H2>
          <IconButton onClick={isSharing ? () => {} : onHide}>
            <SvgIcon path={mdiClose} />
          </IconButton>
        </Flex>
        <Recipients onChangeRecipients={recps => setRecipients(recps)} />
        <ModalFooter>
          <ActionButton size="small" disabled={disabled} onClick={shareHandler}>
            {isSharing ? 'Save and Sharing...' : 'Save & Share'}
          </ActionButton>
        </ModalFooter>
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
    ({ user }) => ({
      user
    }),
    { createRoom, createAlert }
  ),
  withState('recipients', 'setRecipients', {}),
  withState('isSharing', 'setIsSharing', false),
  withState('successModalIsActive', 'setSuccessModalIsActive', false),
  withHandlers({
    shareHandler:
      ({
        user,
        onHide,
        recipients,
        alertTitle,
        createRoom,
        setIsSharing,
        drawingPoints,
        searchOptions,
        setSuccessModalIsActive,
        createAlert
      }) =>
      () => {
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
              Chatroom.openChat(room)
            })
            .catch(() => {
              setIsSharing(false)
            })
        })
      }
  })
)(ShareAlertModal)
