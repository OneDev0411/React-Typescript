import React from 'react'
import { connect } from 'react-redux'

import { Modal, ModalContent } from 'components/Modal'

import ListingDesktopView from '../../Listing/components/ListingDesktopView'

const ListingModalViewer = ({ data, user, show, onHide, listing }) => (
  <div className="c-listing-modal">
    <Modal
      isOpen={show}
      onRequestClose={onHide}
      className="c-listing-modal--box"
    >
      <ModalContent>
        <ListingDesktopView
          data={data}
          user={user}
          onHide={onHide}
          listing={listing}
          container="modal"
        />
      </ModalContent>
    </Modal>
  </div>
)

export default connect(({ data, user }) => ({ data, user }))(ListingModalViewer)
