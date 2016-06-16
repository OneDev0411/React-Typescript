// Partials/FavoritesViewer.js
import React, { Component } from 'react'
import S from 'shorti'
import controller from '../../controller'
import ListingCard from './ListingCard'
export default class AlertViewer extends Component {
  isFavorited(listing_id) {
    return controller.listing_card.isFavorited(listing_id)
  }
  render() {
    const data = this.props.data
    const user = data.user
    const listings = user.favorite_listings
    let listing_gallery_area
    if (listings) {
      listing_gallery_area = (
        <div style={ S('m-0 p-0') }>
          {
            listings.map(listing => {
              return (
                <ListingCard
                  listing={ listing }
                />
              )
            })
          }
        </div>
      )
    }
    const alert_viewer_wrapper_style = S(`w-100p h-${window.innerHeight - 70} absolute z-1 t-70 l-0`)
    const alert_viewer_style = {
      ...S(`bg-fff w-100p h-${window.innerHeight - 70} z-1 t-0 l-0 pl-20 pt-20`),
      overflowY: 'scroll'
    }
    return (
      <div className="alert-viewer" style={ alert_viewer_wrapper_style }>
        <div style={ alert_viewer_style }>
          { listing_gallery_area }
        </div>
      </div>
    )
  }
}
AlertViewer.propTypes = {
  data: React.PropTypes.object
}