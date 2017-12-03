// Partials/ListingMarker.js
import _ from 'lodash'
import S from 'shorti'
import React, { Component } from 'react'
import { numberWithCommas, friendlyDate } from '../../../../utils/helpers'
import Brand from '../../../../controllers/Brand'
import listing_util from '../../../../utils/listing'

export default function ListingMarker({ data, listing, context, popupIsActive }) {
  const { user } = data
  const { listing_map } = data
  const property = listing.compact_property || listing.property
  const address = listing.address || property.address

  const isFavorited = listing => {
    const { mls_number } = listing

    if (
      user &&
      user.favorite_listings &&
      user.favorite_listings.indexOf(mls_number) !== -1
    ) {
      return true
    }

    return false
  }

  const getSocialBadge = listing => {
    let social_icon
    let badge_style = {
      ...S('absolute t-0 pl-4 pr-4 pt-3 w-20 h-21 bg-fff'),
      overflow: 'hidden',
      borderTopLeftRadius: '3px',
      borderBottomLeftRadius: '3px'
    }

    if (listing.commented_by || listing.shared_by) {
      social_icon = 'comment-bubble'
      badge_style = {
        ...badge_style
      }
    }

    if (isFavorited(listing)) {
      social_icon = 'heart'
    }

    if (listing.open_houses) {
      badge_style = {
        ...badge_style,
        ...S('l-18')
      }
    }

    return (
      <div style={badge_style}>
        <img
          alt="map marker"
          src={`/static/images/dashboard/mls/marker/${social_icon}.svg`}
        />
      </div>
    )
  }

  const status_color_class = listing_util.getStatusColorClass(listing.status)

  let price = listing.price

  if (user && listing.close_price && user.user_type === 'Agent') {
    price = listing.close_price
  }

  const price_small = listing_util.getSmallPrice(price)

  let active_class = ''

  if (
    data.listing_map &&
    (listing.id === data.listing_map.active_listing || context === 'single')
  ) {
    active_class = ' active'
  }

  // let popup_class = 'hidden'
  // if (data.listing_map && listing.id === data.listing_map.listing_popup || data.listing_map && listing.id === data.listing_map.active_listing || context === 'single')
  //   popup_class = ''

  const square_feet = numberWithCommas(
    Math.floor(listing_util.metersToFeet(property.square_meters))
  )

  let sold_date

  if (listing.close_date) {
    const sold_date_obj = friendlyDate(listing.close_date)

    sold_date = `${sold_date_obj.month} ${sold_date_obj.date}, ${sold_date_obj.year}`
  }

  let resize_url

  if (listing.cover_image_url) {
    resize_url = listing_util.getResizeUrl(listing.cover_image_url)
  }

  let social_info

  if (listing.shared_by && listing.shared_by.length) {
    social_info = 'Shared by '
    listing.shared_by.forEach((shared_user, shared_i) => {
      if (shared_user.id === user.id) {
        social_info += `You${shared_i === listing.shared_by.length - 1 ? '' : ', '}`
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
        social_info += `You${
          comment_i === listing.commented_by.length - 1 ? '' : ', '
        }`
      } else {
        social_info +=
          (commented_user.first_name.trim()
            ? commented_user.first_name
            : commented_user.email) +
          (comment_i === listing.commented_by.length - 1 ? '' : ', ')
      }
    })
  }

  const markerPopupClassName =
    (data.listing_map && data.listing_map.active_listing === listing.id) ||
    popupIsActive
      ? ''
      : 'hidden'

  const listing_popup = (
    <div
      className={markerPopupClassName}
      style={S('absolute w-240 t-110n l-5 t-110n z-3 bg-fff border-1-solid-929292')}
    >
      <div style={S('pull-left mr-10')}>
        <div
          style={S(`w-80 h-80 bg-url(${`${resize_url}?w=160`}) bg-cover bg-center`)}
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
          style={S(`font-11 color-${listing_util.getStatusColor(listing.status)}`)}
        >
          {listing.status} {sold_date}
        </div>
        <div style={S('w-120 overflow-hidden pb-5')}>{social_info}</div>
      </div>
    </div>
  )

  let marker_style = S('relative w-45 h-21 br-3 color-fff')
  let viewed_class = ''

  // Social badge
  let social_badge

  if (isFavorited(listing) || listing.commented_by) {
    marker_style = {
      ...marker_style,
      ...S('w-65')
    }
    social_badge = getSocialBadge(listing)
  }

  // Brand badge
  let brand_badge

  if (data.brand) {
    const agent =
      listing.proposed_agent && listing.proposed_agent.agent
        ? listing.proposed_agent.agent
        : null

    if (
      listing &&
      agent &&
      agent.mlsid === listing.list_agent_mls_id &&
      !isFavorited(listing) &&
      !listing.commented_by
    ) {
      brand_badge = (
        <div
          style={S(
            `bg-url(${Brand.asset(
              'default_avatar'
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

  if (
    listing_map &&
    listing_map.listings_viewed &&
    listing_map.listings_viewed.indexOf(listing.id) !== -1 &&
    !data.current_listing
  ) {
    viewed_class = ' viewed'
  }

  let listing_marker = (
    <div
      className={`map__listing-marker${active_class}${viewed_class} ${
        status_color_class
      }`}
      style={marker_style}
    >
      {brand_badge}
      {social_badge}
      <div
        style={S(
          `w-100p text-center pt-4${social_badge || brand_badge ? ' pl-22' : ''}`
        )}
      >
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

    if (isFavorited(listing) || listing.commented_by) {
      marker_style = {
        ...marker_style,
        ...S('w-110')
      }
      social_badge = getSocialBadge(listing)
    }

    if (
      listing_map &&
      listing_map.listings_viewed &&
      listing_map.listings_viewed.indexOf(listing.id) !== -1
    ) {
      viewed_class = ' viewed'
    }

    listing_marker = (
      <div
        className={`map__listing-marker${active_class}${viewed_class} ${
          status_color_class
        }`}
        style={marker_style}
      >
        <div style={open_style}>OH</div>
        {brand_badge}
        {social_badge}
        <div
          style={S(
            `w-100p text-center pt-4${social_badge || brand_badge ? ' pl-22' : ''}`
          )}
        >
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
  data: React.PropTypes.object,
  listing: React.PropTypes.object,
  context: React.PropTypes.string,
  popupIsActive: React.PropTypes.bool
}
