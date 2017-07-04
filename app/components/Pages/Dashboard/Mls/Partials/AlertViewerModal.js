import React, { Component } from 'react'
import { connect } from 'react-redux'
import { compose, withState, withHandlers, pure } from 'recompose'
import { Modal, Button } from 'react-bootstrap'
import ListingCard from './FeedModalListingCard'
import ListingModal from '../Listing/ListingModal'
import api from '../../../../../../app/models/Listing'
import AppStore from '../../../../../stores/AppStore'

class AlertViewerModal extends Component {
  render() {
    const {
      data,
      show,
      onHide,
      feed,
      isFetching,
      getListing,
      loadMore,
      selectedListing,
      showListingModal,
      loadMoreLoading,
      toggleListingModal
    } = this.props

    if (!show || !feed.data.length) {
      return false
    }

    return (
      <Modal show={show} onHide={onHide} className="c-feed-modal">
        <Modal.Header className="c-feed-modal__header">
          <h3 className="c-feed-modal__title">{`Shared Listings (${feed.data.length} of ${feed.total})`}</h3>
          <button className="c-feed-modal__close-btn" onClick={onHide}>
            Close
          </button>
        </Modal.Header>
        <Modal.Body className="c-feed-modal__body">
          {feed.data.map((feed_item, index) => (
            <ListingCard
              isFetching={isFetching}
              key={`FEED_${feed_item.id}_${index}`}
              listing={feed_item.listing}
              last_update={feed_item.last_update}
              onClick={() => getListing(feed_item.listing.id)}
            />
          ))}
          {loadMore &&
            <div className="c-feed-modal__loadmore">
              <Button
                bsStyle="primary"
                onClick={loadMore}
                disabled={loadMoreLoading}
              >
                Load More
              </Button>
            </div>}
          <ListingModal
            listing={selectedListing}
            show={showListingModal}
            onHide={() => {
              toggleListingModal(false)
              AppStore.data.fucking_listing_modal_is_active = false
              AppStore.emitChange()
            }}
          />
        </Modal.Body>
      </Modal>
    )
  }
}

const enhance = compose(
  connect(({ data }) => ({ data })),
  withState('isFetching', 'setIsFetching', ''),
  withState('selectedListing', 'setSelectedListing', null),
  withState('showListingModal', 'toggleListingModal', false),
  withHandlers({
    getListing: ({
      setSelectedListing,
      toggleListingModal,
      feed,
      isFetching,
      setIsFetching
    }) => async (id) => {
      if (isFetching) {
        return Promise.resolve()
      }
      setIsFetching(id)
      const listing = await api.getListing(id)
      setIsFetching('')
      setSelectedListing(listing)
      AppStore.data.fucking_listing_modal_is_active = true
      toggleListingModal(true)
      AppStore.emitChange()
    }
  })
)

export default enhance(AlertViewerModal)
