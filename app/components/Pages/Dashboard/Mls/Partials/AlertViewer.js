// Partials/AlertViewer.js
import React, { Component } from 'react'
import S from 'shorti'
import { Button } from 'react-bootstrap'
import controller from '../../controller'
import ListingCard from './ListingCard'
export default class AlertViewer extends Component {
  render() {
    const data = this.props.data
    const current_alert = data.current_alert
    const feed = current_alert.feed
    let listing_gallery_area
    if (current_alert && feed) {
      listing_gallery_area = (
        <div style={S('m-0 p-0')}>
          {
            feed.map(feed_item => (
              <ListingCard
                key={ feed_item.id }
                listing={feed_item.listing}
                last_update={feed_item.last_update}
              />
            ))
          }
        </div>
      )
    }
    const alert_viewer_wrapper_style = S(`w-${window.innerWidth - 420} h-${window.innerHeight - 66} absolute z-3 t-0 l-350`)
    const alert_viewer_style = {
      ...S(`absolute bg-f7f7f7 w-100p h-${window.innerHeight - 66} z-1 l-0 pl-20 pt-70`),
      overflowY: 'scroll'
    }
    const alert_viewer_header_style = S(`w-${window.innerWidth - 420} absolute z-2 pt-25 pr-20 pl-20 h-70 bg-f7f7f7`)
    let more_button
    if (current_alert.feed_info && current_alert.feed_info.total > feed.length) {
      more_button = (
        <div style={S('w-100p p-60 text-center')}>
          <Button
            className={current_alert.loading_more_feed_results ? 'disabled' : ''}
            onClick={controller.alert_viewer.handleMoreResultsClick}
            bsStyle="primary"
            bsSize="large"
          >
            { current_alert.loading_more_feed_results ? 'Loading...' : 'Show more results' }
          </Button>
        </div>
      )
    }
    return (
      <div className="alert-viewer" style={alert_viewer_wrapper_style}>
        <div style={alert_viewer_header_style}>
          <span style={S('color-263445 font-15 fw-500')}>
            New listings ({ current_alert.feed_info ? current_alert.feed_info.total : '' })
          </span>
          <div className="close pull-right" onClick={controller.alert_map.hideAlertViewer.bind(this)}>
            Close &times;
          </div>
        </div>
        <div style={alert_viewer_style}>
          { listing_gallery_area }
          <div className="clearfix" />
          { more_button }
        </div>
      </div>
    )
  }
}
AlertViewer.propTypes = {
  data: React.PropTypes.object
}