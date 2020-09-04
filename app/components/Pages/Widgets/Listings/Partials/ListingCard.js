// Widgets/Partials/ListingCard.js
import React, { Component } from 'react'
import { Link } from 'react-router'
import PropTypes from 'prop-types'
import S from 'shorti'
import styled from 'styled-components'

import listingUtils from '../../../../../utils/listing'
import { numberWithCommas } from '../../../../../utils/helpers'
import FavoriteHeart from '../../../Dashboard/Listings/components/FavoriteHeart'
import AgentImage from './AgentImage'

const Container = styled.div`
  overflow: hidden;
  box-shadow: 0 0 2px 0 rgba(0, 0, 0, 0.2);

  .c-listing-card__link {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    width: 100%;
    height: 100%;
    display: block;
  }

  .c-listing-card__favorite-heart {
    position: absolute;
    right: 1em;
    top: 1em;
    width: 2rem;
    height: 2rem;
  }
`

export default class ListingCard extends Component {
  side(listing) {
    if (!listing.proposed_agent) {
      return
    }

    if (!listing.proposed_agent.agent) {
      return
    }

    const { agent } = listing.proposed_agent

    const is_list_agent =
      agent.mlsid === listing.list_agent_mls_id ||
      agent.mlsid === listing.co_list_agent_mls_id

    const is_selling_agent =
      agent.mlsid === listing.selling_agent_mls_id ||
      agent.mlsid === listing.co_selling_agent_mls_id

    if (is_list_agent && is_selling_agent) {
      return 'Listing & Buyer Agent'
    }

    if (is_list_agent && !is_selling_agent) {
      return 'Listing Agent'
    }

    if (!is_list_agent && is_selling_agent) {
      return 'Buyer Agent'
    }

    return ''
  }

  render() {
    const { listing, user } = this.props
    let { property } = listing

    if (!listing) {
      return null
    }

    if (!property) {
      property = listing.compact_property
    }

    let { address } = listing

    if (!address) {
      address = property.address
    }

    const square_feet = numberWithCommas(
      Math.round(listingUtils.metersToFeet(property.square_meters))
    )
    let listing_card_style = S(
      'w-380 h-360 mr-10 ml-10 mb-20 pull-left br-3 pointer relative'
    )
    const listing_image_style = {
      ...S(
        `bg-cover bg-url(${listingUtils.getResizeUrl(
          listing.cover_image_url
        )}?w=800) bg-center w-380 h-260 relative`
      )
    }

    // Responsive
    if (typeof window !== 'undefined' && window.innerWidth < 1000) {
      listing_card_style.width = window.innerWidth - 20
      listing_card_style.height = listing_card_style.width * '.4'
      listing_card_style = {
        ...listing_card_style,
        ...S('ml-15')
      }

      if (window.innerWidth < 500) {
        listing_card_style.height = listing_card_style.width * '.6'
        listing_card_style.height = 253
      }

      listing_image_style.width = listing_card_style.width
      listing_image_style.height = listing_card_style.height - 130
    }

    const overlay_style = {
      ...S('absolute w-100p h-100p br-3')
    }
    const price = numberWithCommas(listing.price)

    const price_tag_style = {
      bottom: '30px',
      color: '#ffffff',
      fontSize: '26px',
      fontWeight: '500',
      height: '48px',
      padding: '6px 15px 15px',
      position: 'absolute',
      borderTopRightRadius: '3px',
      borderBottomRightRadius: '3px',
      backgroundColor: this.props.brandColor
    }
    const status_color = listingUtils.getStatusColor(listing.status)
    let year_built_area

    if (property.year_built) {
      year_built_area = (
        <span>
          &nbsp;&middot;&nbsp;
          {property.year_built ? `Built in ${property.year_built}` : ''}
        </span>
      )
    }

    return (
      <Container
        style={listing_card_style}
        className={this.props.className}
        key={`widget-listing-viewer-${listing.id}`}
      >
        <div style={listing_image_style}>
          <div style={overlay_style} />
          <div style={price_tag_style}>
            ${price}
            {listingUtils.isLeaseProperty(listing) ? '/mo' : ''}
          </div>
        </div>
        <div style={S('absolute b-0 h-100 p-10 pl-15 color-000')}>
          <div style={S('font-14')}>{listingUtils.addressTitle(address)}</div>
          <div style={S('font-14')}>
            <div style={S('mt-8')}>
              <span>{property.bedroom_count} Beds</span>
              &nbsp;&middot;&nbsp;
              <span>{property.bathroom_count} Baths</span>
              &nbsp;&middot;&nbsp;
              <span>{square_feet} Sqft</span>
              {year_built_area}
            </div>
          </div>
          <div style={S('font-14')}>
            <div style={S('pull-left mr-15 mt-18')}>
              <div
                style={S(`pull-left w-10 h-10 br-100 mr-8 bg-${status_color}`)}
              />
              <div style={S(`pull-left mt-5n color-${status_color}`)}>
                {listing.status}
              </div>
            </div>
            <div
              style={S('pull-left relative t-17 w-1 h-14 bg-e5e5e5 mr-15')}
            />
            <div style={S('pull-left mr-10 mt-13 color-8696a4')}>
              {this.side(listing)}
            </div>
          </div>
        </div>
        <Link
          target="_blank"
          className="c-listing-card__link"
          to={`/dashboard/mls/${listing.id}`}
        />
        <AgentImage
          listing={listing}
          defaultAvatar={this.props.defaultAvatar}
        />
        {user && (
          <div className="c-listing-card__favorite-heart">
            <FavoriteHeart listing={listing} />
          </div>
        )}
      </Container>
    )
  }
}

ListingCard.propTypes = {
  user: PropTypes.object,
  listing: PropTypes.object.isRequired
}
