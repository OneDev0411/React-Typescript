// Partials/ListingPanel.js
import React, { Component } from 'react'
import { Button, DropdownButton, MenuItem } from 'react-bootstrap'
import S from 'shorti'
import helpers from '../../../../../../../utils/helpers'
import listing_util from '../../../../../../../utils/listing'
import FavoriteHeart from '../../../../Partials/FavoriteHeart'

export default class GridView extends Component {
  render() {
    const { data, listings, activePanel, tabName } = this.props
    const user = data.user

    let listing_panel_cards = null

    listing_panel_cards = listings.data.map((listing, i) => {
      const status_color = listing_util.getStatusColor(listing.status)
      let property = listing.compact_property
      let address = listing.address

      if (!property) {
        property = listing.property
      }

      if (!address) {
        address = property.address
      }

      let listing_image = <div style={S('w-300 h-225 bg-efefef')} />

      if (listing.cover_image_url) {
        listing_image = (
          <div
            style={S(
              `w-300 h-225 
              bg-url(${listing.cover_image_url}) 
              bg-cover bg-center br-3`
            )}
          />
        )
      }

      const square_feet = helpers.numberWithCommas(
        Math.floor(listing_util.metersToFeet(property.square_meters))
      )

      const image_overlay = {
        ...S('bg-000 absolute w-100p h-100p br-3'),
        opacity: '.2'
      }

      let open_houses
      if (listing.open_houses) {
        const num_open_houses = listing.open_houses.length
        open_houses = (
          <div>
            &nbsp;|&nbsp;<span className="text-success">
              {num_open_houses} Open Houses
            </span>
          </div>
        )
      }

      // Price
      let price = listing.price
      if (listing.close_price && user && user.user_type === 'Agent') {
        price = listing.close_price
      }

      // Social info
      let social_info
      if (listing.shared_by && listing.shared_by.length) {
        social_info = 'Shared by '
        listing.shared_by.forEach((shared_user, shared_i) => {
          if (shared_user.id === user.id) {
            social_info += `You ${shared_i === listing.shared_by.length - 1
              ? ''
              : ', '}`
          } else {
            social_info +=
              (shared_user.first_name.trim()
                ? shared_user.first_name
                : shared_user.email) +
              (shared_i === listing.shared_by.length - 1 ? '' : ', ')
          }
        })
      }

      if (listing.commented_by && listing.commented_by.length) {
        social_info = 'Commented by '
        listing.commented_by.forEach((commented_user, comment_i) => {
          if (commented_user.id === user.id) {
            social_info += `You ${comment_i === listing.comment_by.length - 1
              ? ''
              : ', '}`
          } else {
            social_info +=
              (commented_user.first_name.trim()
                ? commented_user.first_name
                : commented_user.email) +
              (comment_i === listing.commented_by.length - 1 ? '' : ', ')
          }
        })
      }

      let details_area = (
        <div style={S('font-14')}>
          <span>{property.bedroom_count} Beds</span>
          &nbsp;&nbsp;&nbsp;&middot;&nbsp;&nbsp;&nbsp;
          <span>{property.bathroom_count} Baths</span>
          &nbsp;&nbsp;&nbsp;&middot;&nbsp;&nbsp;&nbsp;
          <span>{square_feet} Sqft</span>
        </div>
      )

      return (
        <div
          key={`panel-listing-grid-${listing.id}-${i}`}
          style={S(
            'relative pointer w-310 h-235 pb-10 pl-10 bg-fff pull-left br-3'
          )}>
          <div style={S('absolute r-0')}>
            <FavoriteHeart listing={listing} />
          </div>
          <div style={S('relative')}>
            <div style={image_overlay} />
            {listing_image}
            <div style={S('absolute color-fff l-10 b-10')}>
              <div style={S('mb-10')}>
                <span
                  style={S(`bg-${status_color} pt-6 pr-10 pb-6 pl-10 br-3`)}>
                  {listing.status}
                </span>
              </div>
              <div
                style={{
                  ...S('font-21 fw-600 mb-5'),
                  textShadow: '0 1px 4px rgba(0, 0, 0, 0.2)'
                }}>
                {listing_util.addressTitle(address)}
              </div>
              <div style={S('font-17 fw-600')}>
                ${helpers.numberWithCommas(Math.floor(price))}
              </div>
              {details_area}
            </div>
          </div>
        </div>
      )
    })

    // Listing panel
    let heading_height = 150
    let panel_top = 80
    let panel_width = 320

    let listing_panel_style_shorti = S(
      `absolute t-0 w-${panel_width} bg-fff h-${window.innerHeight}`
    )
    let listing_scroll_style = {
      ...listing_panel_style_shorti,
      top: `${panel_top}px`,
      height: window.innerHeight - heading_height + 20,
      overflowY: 'scroll'
    }

    return (
      <div style={listing_scroll_style}>
        <div style={S('m-0 p-0')}>
          {listing_panel_cards}
          <div className="clearfix" />
        </div>
      </div>
    )
  }
}
