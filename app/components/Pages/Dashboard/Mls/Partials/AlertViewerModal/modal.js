import React, { Component } from 'react'
import shallowCompare from 'react-addons-shallow-compare'
import { connect } from 'react-redux'
// import { pure, compose, withState, withHandlers } from 'recompose'
import { Modal, Button } from 'react-bootstrap'
import ListingCard from '../FeedModalListingCard'
import ListingModal from '../../Listing/ListingModal'
import api from '../../../../../../../app/models/Listing'
import AppStore from '../../../../../../stores/AppStore'

class AlertViewerModal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isFetching: '',
      selectedListing: null,
      showListingModal: false
    }
  }

  shouldComponentUpdate(nextProps, nextState) {
    return shallowCompare(this, nextProps, nextState)
  }

  toggleListingModal(state) {
    this.setState({ showListingModal: state })
  }

  setSelectedListing(listing) {
    this.setState({
      selectedListing: listing,
      isFetching: ''
    })
  }

  setIsFetching(id) {
    this.setState({ isFetching: id })
  }

  async getListing(id){

    const { isFetching } = this.state

    if (isFetching === true) {
      return Promise.resolve()
    }

    this.setIsFetching(id)
    const listing = await api.getListing(id)

    this.setSelectedListing(listing)
    this.toggleListingModal(true)
  }

  render() {
    const {
      data,
      show,
      onHide,
      feed,
      loadMore,
      loadMoreLoading,
    } = this.props

    const { isFetching, selectedListing, showListingModal } = this.state

    if (!show || feed.data.length === 0) {
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
              onClick={() => this.getListing(feed_item.listing.id)}
            />
          ))}
          {loadMore &&
            <div className="c-feed-modal__loadmore">
              <Button
                bsStyle="primary"
                onClick={loadMore}
                disabled={loadMoreLoading}
              >
                { loadMoreLoading ? 'Loading ...' : 'Load More' }
              </Button>
            </div>}
          <ListingModal
            listing={selectedListing}
            show={showListingModal}
            onHide={() => {
              this.toggleListingModal(false)
              // AppStore.data.fucking_listing_modal_is_active = false
              // AppStore.emitChange()
            }}
          />
        </Modal.Body>
      </Modal>
    )
  }
}

// const enhance = compose(
//   pure,
//   connect(({ data }) => ({ data })),
//   withState('isFetching', 'setIsFetching', ''),
//   withState('selectedListing', 'setSelectedListing', null),
//   withState('showListingModal', 'toggleListingModal', false),
//   withHandlers({
//     ___getListing: ({
//       setSelectedListing,
//       toggleListingModal,
//       feed,
//       isFetching,
//       setIsFetching
//     }) => async (id) => {
//       // if (isFetching) {
//       //   return Promise.resolve()
//       // }
//       // setIsFetching(id)
//       // const listing = await api.getListing(id)
//       // setIsFetching('')
//       // setSelectedListing(listing)
//       // AppStore.data.fucking_listing_modal_is_active = true
//       // toggleListingModal(true)
//       // AppStore.emitChange()
//     }
//   })
// )

// export default enhance(AlertViewerModal)
export default AlertViewerModal
