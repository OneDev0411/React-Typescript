import React from 'react'

import {
  Box,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  useTheme
} from '@material-ui/core'
import { mdiClose } from '@mdi/js'
import { connect } from 'react-redux'
import compose from 'recompose/compose'
import withHandlers from 'recompose/withHandlers'
import withState from 'recompose/withState'

import Chatroom from '@app/components/Pages/Dashboard/Chatroom/Util/chatroom'

import createRecommendation from '../../../../../../models/recommendation/create-recs'
import { createRoom } from '../../../../../../store_actions/chatroom/room'
import { hasRecipients } from '../../../../../../utils/helpers'
import ActionButton from '../../../../../../views/components/Button/ActionButton'
import IconButton from '../../../../../../views/components/Button/IconButton'
import { SvgIcon } from '../../../../../../views/components/SvgIcons/SvgIcon'
import Recipients from '../../../../../Partials/ShareView'

import SuccessModal from './SuccessModal'

const ShareListingModal = ({
  onHide,
  isActive,
  isSharing,
  recipients,
  shareHandler,
  setRecipients,
  successModalIsActive
}) => {
  const theme = useTheme()
  const disabled = isSharing || !hasRecipients(recipients)

  return (
    <>
      <Dialog
        open={isActive}
        maxWidth="sm"
        fullWidth
        onClose={isSharing ? () => {} : onHide}
        style={{ zIndex: theme.zIndex.modal + 2 }}
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
    shareHandler:
      ({
        onHide,
        listing,
        recipients,
        createRoom,
        setIsSharing,
        setSuccessModalIsActive
      }) =>
      () => {
        const { id: listing_id } = listing
        const notification = true

        setIsSharing(true)

        createRoom(recipients).then(room => {
          createRecommendation({ room, listing_id, notification })
            .then(recsId => {
              setIsSharing(false)

              if (recsId) {
                onHide()
                setSuccessModalIsActive(true)
                setTimeout(() => setSuccessModalIsActive(false), 2000)
                Chatroom.openChat(room)
              }
            })
            .catch(() => {
              setIsSharing(false)
            })
        })
      }
  })
)(ShareListingModal)
