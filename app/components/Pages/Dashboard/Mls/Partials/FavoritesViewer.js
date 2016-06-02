// Partials/FavoritesViewer.js
import React, { Component } from 'react'
import S from 'shorti'
import controller from '../../controller'
import listing_util from '../../../../../utils/listing'
import helpers from '../../../../../utils/helpers'
export default class AlertViewer extends Component {
  isFavorited(listing_id) {
    return controller.alert_viewer.isFavorited(listing_id)
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
              const property = listing.compact_property
              const square_feet = helpers.numberWithCommas(Math.floor(listing_util.metersToFeet(property.square_meters)))
              const listing_card_style = {
                ...S(`w-375 h-320 mr-20 mb-20 pull-left br-3 pointer relative`),
                boxShadow: '0 0 2px 0 rgba(0, 0, 0, 0.2)',
                borderTopRightRadius: '3px',
                borderTopLeftRadius: '3px'
              }
              const listing_image_style = {
                ...S(`bg-cover bg-url(${listing.cover_image_url}) bg-center w-375 h-270 relative`),
                backgroundSize: 'attachment',
                borderTopRightRadius: '3px',
                borderTopLeftRadius: '3px'
              }
              const overlay_style = {
                ...S('bg-000 absolute w-100p h-100p'),
                opacity: '.3',
                borderTopRightRadius: '3px',
                borderTopLeftRadius: '3px'
              }
              return (
                <div key={ 'listing-viewer-' + listing.id } style={ listing_card_style }>
                  <img
                    onClick={ controller.alert_viewer.handleFavoriteAction.bind(this, listing.id) } style={ S('absolute r-10 t-15 w-44 h-40 mr-5 z-2') }
                    src={`/images/dashboard/mls/heart${this.isFavorited(listing.id) ? '-red' : '-white'}.svg`}
                  />
                  <div style={ listing_image_style } onClick={ controller.listing_viewer.showListingViewer.bind(this, listing) }>
                    <div style={ overlay_style }></div>
                    <div style={ S('absolute b-0 p-10 color-fff') }>
                      <div style={ S('font-24 fw-500') }>${ helpers.numberWithCommas(listing.price) }</div>
                      <div style={ { opacity: '.9' } }>{ listing_util.addressTitle(listing.address) }</div>
                      <div style={ { opacity: '.9' } }>
                        <span>{ property.bedroom_count } Beds</span>
                        &nbsp;&nbsp;&nbsp;&middot;&nbsp;&nbsp;&nbsp;
                        <span>{ property.bathroom_count } Baths</span>
                        &nbsp;&nbsp;&nbsp;&middot;&nbsp;&nbsp;&nbsp;
                        <span>{ square_feet } Sqft</span>
                        &nbsp;&nbsp;&nbsp;&middot;&nbsp;&nbsp;&nbsp;
                        <span>{ property.year_built ? 'Built in ' + property.year_built : '' }</span>
                      </div>
                    </div>
                  </div>
                  <div style={ S('mt-12 ml-15 font-18') } onClick={ controller.listing_viewer.showListingViewer.bind(this, listing) }>
                    <img style={ S('w-23 h-13 mr-5') }src="/images/dashboard/mls/eye.svg"/>
                    <span style={ S('color-c3c3c3 mr-15 t-1 relative') }>8</span>
                    <img style={ S('w-23 h-13 mr-5') }src="/images/dashboard/mls/heart.svg"/>
                    <span style={ S('color-c3c3c3 mr-20 t-1 relative') }>3</span>
                    <img style={ S('w-14 h-13 mr-5') }src="/images/dashboard/mls/comment.svg"/>
                    <span style={ S('color-c3c3c3 t-1 relative') }>1</span>
                    <img onClick={ controller.listing_viewer.showShareListingModal.bind(this, listing) } style={ S('w-17 h-24 mr-15 mt-1 pull-right') }src="/images/dashboard/mls/share.svg"/>
                  </div>
                </div>
              )
            })
          }
        </div>
      )
    }
    const alert_viewer_wrapper_style = S(`w-100p h-100p absolute z-1 t-0 l-0`)
    const alert_viewer_style = {
      ...S(`bg-fff w-100p h-${window.innerHeight - 70} z-1 t-0 l-0 pl-20 pt-20`),
      overflowY: 'scroll'
    }
    const alert_viewer_header_style = S('pt-25 pr-20 pl-20 h-70 bg-f8fafb border-bottom-1-solid-d3d3d3')
    return (
      <div className="alert-viewer" style={ alert_viewer_wrapper_style }>
        <div style={ alert_viewer_header_style }>
          <span style={ S('color-263445 font-15 fw-500') }>Favorites</span>
          <div className="close pull-right" onClick={ controller.favorites_viewer.hideFavoritesViewer.bind(this) }>&times;</div>
        </div>
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