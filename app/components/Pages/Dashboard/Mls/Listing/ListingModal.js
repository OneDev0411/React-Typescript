import React, { Component } from 'react'
import { connect } from 'react-redux'
import AppStore from '../../../../../stores/AppStore'
import ListingDispatcher from '../../../../../dispatcher/ListingDispatcher'
import ContactModel from '../../../../../models/Contact'
import controller from '../../controller'
import Brand from '../../../../../controllers/Brand'
import S from 'shorti'
import ListingViewer from '../../Partials/ListingViewer'
import ListingViewerMobile from '../../Partials/ListingViewerMobile'
import { Modal } from 'react-bootstrap'

class ListingModal extends Component {
  componentWillReceiveProps(nextProps) {
    const { show, listing, data } = nextProps
    const { current_listing } = data

    if (!current_listing) {
      AppStore.data.current_listing = listing
      AppStore.emitChange()
    }
  }

  render() {
    const { data, show, onHide, listing } = this.props
    const { user, current_listing } = data

    if (!show || !listing || !current_listing)
      return false

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
        <Modal
          dialogClassName="c-listing-modal--box"
          show={show}
          onHide={onHide}
        >
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

export default connect(({ data }) => ({ data }))(ListingModal)
