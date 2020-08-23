import React from 'react'
import { connect } from 'react-redux'
import compose from 'recompose/compose'
import withState from 'recompose/withState'
import withHandlers from 'recompose/withHandlers'
import { Modal } from 'react-bootstrap'
import Flex from 'styled-flex-component'
import { mdiClose } from '@mdi/js'

import SuccessModal from './SuccessModal'
import Recipients from '../../../../../Partials/ShareView'
import { hasRecipients } from '../../../../../../utils/helpers'
import { createRoom } from '../../../../../../store_actions/chatroom/room'
import createRecommendation from '../../../../../../models/recommendation/create-recs'

import ActionButton from '../../../../../../views/components/Button/ActionButton'
import IconButton from '../../../../../../views/components/Button/IconButton'
import { SvgIcon } from '../../../../../../views/components/SvgIcons/SvgIcon'
import { H2 } from '../../../../../../views/components/Typography/headings'

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
    <div>
      <Modal
        show={isActive}
        onHide={isSharing ? () => {} : onHide}
        className="c-share-modal"
      >
        <Flex alignCenter justifyBetween style={{ padding: '1em' }}>
          <H2>Share Listing</H2>
          <IconButton
            isFit
            iconSize="large"
            onClick={isSharing ? () => {} : onHide}
          >
            <SvgIcon path={mdiClose} />
          </IconButton>
        </Flex>
        <Modal.Body style={{ padding: 0 }}>
          <Recipients onChangeRecipients={recps => setRecipients(recps)} />
        </Modal.Body>
        <Modal.Footer>
          <ActionButton size="small" disabled={disabled} onClick={shareHandler}>
            {isSharing ? 'Sharing...' : 'Share'}
          </ActionButton>
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
