import React, { Component } from 'react'
import shallowCompare from 'react-addons-shallow-compare'
import { connect } from 'react-redux'
import { Modal, Button } from 'react-bootstrap'

import ListingModalViewer from '../../ListingModalViewer'
import Loading from '../../../../../../../components/Partials/Loading'
import ListingCard from '../../../../Listings/components/ListingsPanels/GridView/ListingCard'

class AlertViewerModal extends Component {
  constructor(props) {
    super(props)
    this.state = {
      selectedListing: null,
      showListingModal: false
    }
  }

  shouldComponentUpdate(nextProps, nextState) {
    return shallowCompare(this, nextProps, nextState)
  }

  render() {
    const { show, onHide, feed } = this.props

    const { isFetching, selectedListing, showListingModal } = this.state

    if (!show || feed == null) {
      return false
    }

    return (
      <Modal show={show} onHide={onHide} className="c-feed-modal">
        <Modal.Header className="c-feed-modal__header">
          <h3 className="c-feed-modal__title">
            {`Shared Listings (${feed.length})`}
          </h3>
          <button className="c-feed-modal__close-btn" onClick={onHide}>
            Close
          </button>
        </Modal.Header>
        <Modal.Body className="c-feed-modal__body clearfix">
          {feed.map((listing, index) => (
            <ListingCard
              listing={listing}
              key={`FEED_ITEM_${index}`}
              onClick={() =>
                this.setState({
                  showListingModal: true,
                  selectedListing: listing
                })
              }
            />
          ))}
          <ListingModalViewer
            show={showListingModal}
            listing={selectedListing}
            onHide={() => this.setState({ showListingModal: false })}
          />
        </Modal.Body>
      </Modal>
    )
  }
}

export default AlertViewerModal
