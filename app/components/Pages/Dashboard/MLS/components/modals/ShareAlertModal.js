import React from 'react'
import { connect } from 'react-redux'
import { IconButton } from '@material-ui/core'
import compose from 'recompose/compose'
import withState from 'recompose/withState'
import withHandlers from 'recompose/withHandlers'
import Flex from 'styled-flex-component'

import { mdiClose } from '@mdi/js'

import { Modal, ModalFooter } from 'components/Modal'

import { hasRecipients } from 'utils/helpers'
import { createRoom } from 'actions/chatroom/room'
import createAlert from 'actions/listings/alerts/create-alert'

import ActionButton from 'components/Button/ActionButton'
import { H2 } from 'components/Typography/headings'
import { SvgIcon } from 'components/SvgIcons/SvgIcon'

import Recipients from '../../../../../Partials/ShareView'

import SuccessModal from './SuccessModal'
import { normalizeAlertOptions } from './normalize-alert-options'

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
    ({ user, search }) => ({
      user,
      searchOptions: search.options,
      drawingPoints: search.map.drawing.points
    }),
    { createRoom, createAlert }
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
      setSuccessModalIsActive,
      createAlert
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
