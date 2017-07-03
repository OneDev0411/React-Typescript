import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Modal } from 'react-bootstrap'
import ListingCard from './ListingCard'

class AlertViewerModal extends Component {
  render() {
    const { data, show, onHide, feed = [] } = this.props

    if (!show || !feed.length) {
      return false
    }

    return (
      <Modal show={show} onHide={onHide} className="c-feed-modal">
        <Modal.Header className="c-feed-modal__header">
          <h3 className="c-feed-modal__title">{`Shared Listings (${feed.length})`}</h3>
          <button className="c-feed-modal__close-btn" onClick={onHide}>
            Close
          </button>
        </Modal.Header>
        <Modal.Body className="c-feed-modal__body">
          {feed.length &&
            feed.map(feed_item => (
              <ListingCard
                key={feed_item.id}
                listing={feed_item.listing}
                last_update={feed_item.last_update}
              />
            ))}
        </Modal.Body>
      </Modal>
    )
  }
}

export default connect(({ data }) => ({ data }))(AlertViewerModal)
