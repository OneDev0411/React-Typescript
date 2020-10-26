import React from 'react'
import { connect } from 'react-redux'
import compose from 'recompose/compose'
import withState from 'recompose/withState'
import withHandlers from 'recompose/withHandlers'
import { mdiClose } from '@mdi/js'

// import { Modal, ModalFooter } from 'components/Modal'
import {
  Box,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle
} from '@material-ui/core'

import SuccessModal from './SuccessModal'
import Recipients from '../../../../../Partials/ShareView'
import { hasRecipients } from '../../../../../../utils/helpers'
import { createRoom } from '../../../../../../store_actions/chatroom/room'
import createRecommendation from '../../../../../../models/recommendation/create-recs'

import ActionButton from '../../../../../../views/components/Button/ActionButton'
import IconButton from '../../../../../../views/components/Button/IconButton'
import { SvgIcon } from '../../../../../../views/components/SvgIcons/SvgIcon'

const ShareListingModal = ({
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
    <>
      <Dialog
        open={isActive}
        maxWidth="sm"
        fullWidth
        onClose={isSharing ? () => {} : onHide}
      >
        <DialogTitle>
          <Box
            display="flex"
            alignItems="center"
            justifyContent="space-between"
          >
            Share Listing
            <IconButton
              isFit
              iconSize="large"
              onClick={isSharing ? () => {} : onHide}
            >
              <SvgIcon path={mdiClose} />
            </IconButton>
          </Box>
        </DialogTitle>

        <DialogContent>
          <Recipients onChangeRecipients={recps => setRecipients(recps)} />
        </DialogContent>
        <DialogActions>
          <ActionButton size="small" disabled={disabled} onClick={shareHandler}>
            {isSharing ? 'Sharing...' : 'Share'}
          </ActionButton>
        </DialogActions>
      </Dialog>
      <SuccessModal text="Listing Shared" isActive={successModalIsActive} />
    </>
  )
}

export default compose(
  connect(null, { createRoom }),
  withState('recipients', 'setRecipients', {}),
  withState('isSharing', 'setIsSharing', false),
  withState('successModalIsActive', 'setSuccessModalIsActive', false),
  withHandlers({
    shareHandler: ({
      onHide,
      listing,
      recipients,
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
          .catch(() => {
            setIsSharing(false)
          })
      })
    }
  })
)(ShareListingModal)
