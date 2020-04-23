import S from 'shorti'
import React from 'react'
import PropTypes from 'prop-types'
import numeral from 'numeral'
import fecha from 'fecha'

import listing_util from 'utils/listing'

import Brand from '../../../../../controllers/Brand'

export default function ListingMarker({ user, brand, listing, popupIsActive }) {
  const property = listing.compact_property || listing.property
  const address = listing.address || property.address

  const status_color_class = listing_util.getStatusColorClass(listing.status)

  let price = listing.price

  if (user && listing.close_price && user.user_type === 'Agent') {
    price = listing.close_price
  }

  const price_small = numeral(price).format('0.[00]a')

  const square_feet = Math.floor(
    listing_util.metersToFeet(property.square_meters)
  ).toLocaleString()

  let sold_date

  if (listing.close_date) {
    sold_date = fecha.format(listing.close_date * 1000, 'mediumDate')
  }

  let resize_url

  if (listing.cover_image_url) {
    resize_url = listing_util.getResizeUrl(listing.cover_image_url)
  }

  let social_info

  const markerPopupClassName = popupIsActive ? '' : 'hidden'

  const listing_popup = (
    <div
      className={markerPopupClassName}
      style={S(
        'absolute w-240 t-110n l-5 t-110n z-3 bg-fff border-1-solid-929292'
      )}
    >
      <div style={S('pull-left mr-10')}>
        <div
          style={S(
            `w-80 h-80 bg-url(${`${resize_url}?w=160`}) bg-cover bg-center`
          )}
        />
      </div>
      <div style={S('pull-left pt-10')}>
        <div
          className="listing-map__marker__popup__title"
          style={S('font-12 w-140')}
        >
          {listing_util.addressTitle(address)}
        </div>
        <div style={S('font-11')}>
          {property.bedroom_count} Beds,&nbsp;
          {property.bathroom_count} Baths,&nbsp;
          {square_feet} Sqft
        </div>
        <div
          style={S(
            `font-11 color-${listing_util.getStatusColor(listing.status)}`
          )}
        >
          {listing.status} {sold_date}
        </div>
        <div style={S('w-120 overflow-hidden pb-5')}>{social_info}</div>
      </div>
    </div>
  )

  let marker_style = S('relative w-45 h-21 br-3 color-fff')

  // Brand badge
  let brand_badge

  if (brand) {
    const agent =
      listing.proposed_agent && listing.proposed_agent.agent
        ? listing.proposed_agent.agent
        : null

    if (listing && agent && agent.mlsid === listing.list_agent_mls_id) {
      brand_badge = (
        <div
          style={S(
            `bg-url(${Brand.asset(
              'default_avatar',
              '',
              brand
            )}) w-21 h-21 bg-center bg-cover pull-left inline-block`
          )}
        />
      )
      marker_style = {
        ...marker_style,
        ...S('w-65 z-100')
      }
    }
  }

  let listing_marker = (
    <div
      className={`map__listing-marker ${status_color_class}`}
      style={marker_style}
    >
      {brand_badge}
      <div style={S(`w-100p text-center pt-4${brand_badge ? ' pl-22' : ''}`)}>
        {price_small}
        {listing.compact_property &&
        listing.compact_property.property_type === 'Residential Lease'
          ? '/mo'
          : ''}
      </div>
    </div>
  )

  // Open house
  if (listing.open_houses) {
    // Open house marker
    const open_style = {
      ...S(
        'bg-fff w-25 h-100p color-35b863 font-10 pt-8 inline-block pull-left bold'
      ),
      lineHeight: '5px'
    }

    marker_style = { ...marker_style, ...S('w-70') }

    listing_marker = (
      <div
        className={`map__listing-marker ${status_color_class}`}
        style={marker_style}
      >
        <div style={open_style}>OH</div>
        {brand_badge}
        <div style={S(`w-100p text-center pt-4${brand_badge ? ' pl-22' : ''}`)}>
          {price_small}
        </div>
      </div>
    )
  }

  return (
    <div>
      {listing_popup}
      {listing_marker}
    </div>
  )
}

ListingMarker.propTypes = {
  user: PropTypes.shape(),
  brand: PropTypes.shape(),
  listing: PropTypes.shape(),
  popupIsActive: PropTypes.bool
}
