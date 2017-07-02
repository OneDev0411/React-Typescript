import React, { Component } from 'react'
import ListingDispatcher from '../../../../../dispatcher/ListingDispatcher'
import ContactModel from '../../../../../models/Contact'
import controller from '../../controller'
import Brand from '../../../../../controllers/Brand'
import S from 'shorti'
import ListingViewer from '../../Partials/ListingViewer'
import ListingViewerMobile from '../../Partials/ListingViewerMobile'
import { Modal } from 'react-bootstrap'

export default class ListingModal extends Component {
  render() {
    const { data, show, onHide, listing } = this.props
    const user = data.user

    if (!listing) {
      return <div />
    }

    let modalBody = (
      <ListingViewer
        data={data}
        hideListingViewer={onHide}
        listing={listing}
        hideModal={controller.listing_map.hideModal}
        showModalGallery={controller.listing_viewer.showModalGallery}
        handleModalGalleryNav={controller.listing_viewer.handleModalGalleryNav}
        showShareListingModal={controller.listing_viewer.showShareListingModal}
      />
    )
    // Check for mobile
    if (data.is_mobile) {
      modalBody = (
        <ListingViewerMobile
          data={data}
          hideListingViewer={onHide}
          listing={listing}
          hideModal={controller.listing_map.hideModal}
          showModalGallery={controller.listing_viewer.showModalGallery}
          handleModalGalleryNav={
            controller.listing_viewer.handleModalGalleryNav
          }
          showShareListingModal={
            controller.listing_viewer.showShareListingModal
          }
        />
      )
    }

    return (
      <div className="c-listing-modal">
        <Modal show={show} onHide={onHide}>
          <Modal.Body>
            {modalBody}
          </Modal.Body>
        </Modal>
      </div>
    )
  }
}
ListingModal.propTypes = {
  data: React.PropTypes.object,
  id: React.PropTypes.string,
  show: React.PropTypes.bool,
  onHide: React.PropTypes.func
}
