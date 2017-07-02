import React, { Component } from 'react'
import S from 'shorti'
import { Modal } from 'react-bootstrap'
import controller from '../../controller'
import ListingCard from './ListingCard'

class AlertViewerModal extends Component {
  render() {
    const { data, show, onHide, feed } = this.props
    const { user } = data

    if (!show || !feed) {
      return false
    }

    let listing_gallery_area
    if (feed) {
      listing_gallery_area = (
        <div style={S('m-0 p-0')}>
          {feed.map(feed_item => (
            <ListingCard
              key={feed_item.id}
              listing={feed_item.listing}
              last_update={feed_item.last_update}
            />
          ))}
        </div>
      )
    }
    const alert_viewer_style = {
      ...S(
        `absolute bg-f7f7f7 w-100p h-${window.innerHeight - 66} z-1 l-0 pl-20 pt-70`
      ),
      overflowY: 'scroll'
    }
    const alert_viewer_header_style = S(
      `w-${window.innerWidth - 420} absolute z-2 pt-25 pr-20 pl-20 h-70 bg-f7f7f7`
    )

    const modalBody = (
      <div className="alert-viewer" style={alert_viewer_wrapper_style}>
        <div style={alert_viewer_style}>
          {listing_gallery_area}
        </div>
      </div>
    )

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

export default connect(({ data }) => ({ data }))(AlertViewerModal)
