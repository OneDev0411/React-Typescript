// Partials/ListingPanel.js
import React, { Component } from 'react'
import { Button, DropdownButton, MenuItem } from 'react-bootstrap'
import S from 'shorti'
import helpers from '../../../../../utils/helpers'
import listing_util from '../../../../../utils/listing'
import FavoriteHeart from '../../Partials/FavoriteHeart'
export default class ListingPanel extends Component {
  getSortingTitle() {
    const data = this.props.data
    const listing_map = data.listing_map

    let sortby_title
    if (listing_map.sorting_by) {
      switch (listing_map.sorting_by) {
        case 'area':
          sortby_title = 'Area'
          break
        case 'price':
          sortby_title = 'Price'
          break
        case 'bedroom_count':
          sortby_title = 'Beds'
          break
        case 'bathroom_count':
          sortby_title = 'Baths'
          break
        case 'square_meters':
          sortby_title = 'Sqft'
          break
        case 'year_built':
          sortby_title = 'Built'
          break
        case 'dom':
          sortby_title = 'Days on market'
          break
        case 'price_per_square_foot':
          sortby_title = '$/Sqft'
          break
        case 'distance':
          sortby_title = 'Distance to map center'
          break
        default:
          return true
      }
      if (listing_map.sorting_direction === -1)
        sortby_title += ' high to low'
      else
        sortby_title += ' low to high'
    }
    return sortby_title
  }
  render() {
    const data = this.props.data
    const user = data.user
    const listing_map = data.listing_map
    if (!listing_map || listing_map && !listing_map.listings)
      return <div></div>
    let listings
    if (data.listing_map)
      listings = data.listing_map.listings
    if (data.show_alerts_map && data.alerts_map && data.alerts_map.listings)
      listings = data.alerts_map.listings
    if (data.show_actives_map && data.favorite_listings)
      listings = data.favorite_listings
    const listing_panel_cards = listings.map((listing, i) => {
      const status_color = listing_util.getStatusColor(listing.status)
      let property = listing.compact_property
      let address = listing.address
      if (!property)
        property = listing.property
      if (!address)
        address = property.address
      let listing_image = <div style={ S('w-405 h-300 bg-efefef') }/>
      if (listing.cover_image_url)
        listing_image = <div style={ S('w-405 h-300 bg-url(' + listing.cover_image_url + ') bg-cover bg-center') } />
      const square_feet = helpers.numberWithCommas(Math.floor(listing_util.metersToFeet(property.square_meters)))
      const image_overlay = {
        ...S('bg-000 absolute w-100p h-100p'),
        opacity: '.2'
      }
      let open_houses
      if (listing.open_houses) {
        const num_open_houses = listing.open_houses.length
        open_houses = (
          <div>
          &nbsp;|&nbsp;<span className="text-success">{ num_open_houses } Open Houses</span>
          </div>
        )
      }
      // Price
      let price = listing.price
      if (listing.close_price && user && user.user_type === 'Agent')
        price = listing.close_price
      // Social info
      let social_info
      if (listing.shared_by && listing.shared_by.length) {
        social_info = 'Shared by '
        listing.shared_by.forEach((shared_user, shared_i) => {
          if (shared_user.id === user.id)
            social_info += 'You' + (shared_i === listing.shared_by.length - 1 ? '' : ', ')
          else
            social_info += (shared_user.first_name.trim() ? shared_user.first_name : shared_user.email) + (shared_i === listing.shared_by.length - 1 ? '' : ', ')
        })
      }
      if (listing.commented_by && listing.commented_by.length) {
        social_info = 'Commented by '
        listing.commented_by.forEach((commented_user, comment_i) => {
          if (commented_user.id === user.id)
            social_info += 'You' + (comment_i === listing.commented_by.length - 1 ? '' : ', ')
          else
            social_info += (commented_user.first_name.trim() ? commented_user.first_name : commented_user.email) + (comment_i === listing.commented_by.length - 1 ? '' : ', ')
        })
      }
      return (
        <div onMouseOut={ this.props.removeActiveListing.bind(this) } onMouseOver={ this.props.setActiveListing.bind(this, listing) } key={ 'panel-listing-grid-' + listing.id + '-' + i } style={ S('relative pointer w-415 h-350 pb-10 pl-10 bg-fff pull-left') }>
          <div style={ S('absolute r-0') }>
            <FavoriteHeart
              listing={ listing }
            />
          </div>
          <div onClick={ this.props.showListingViewer.bind(this, listing) } style={ S('relative') }>
            <div style={ image_overlay } />
            { data.show_listing_panel ? listing_image : '' }
            <div style={ S('absolute color-fff l-15 b-15') }>
              <div style={ S('mb-10') }>
                <span style={ S(`bg-${status_color} pt-6 pr-10 pb-6 pl-10 br-3`) }>
                  { listing.status }
                </span>
              </div>
              <div style={ { ...S('font-21 fw-600 mb-10'), textShadow: '0 1px 4px rgba(0, 0, 0, 0.2)' } }>
                { listing_util.addressTitle(address) }
              </div>
              <div style={ S('font-17 fw-600') }>
                ${ helpers.numberWithCommas(Math.floor(price)) }
              </div>
              <div style={ S('font-14') }>
                <span>{ property.bedroom_count } Beds</span>
                &nbsp;&nbsp;&nbsp;&middot;&nbsp;&nbsp;&nbsp;
                <span>{ property.bathroom_count } Baths</span>
                &nbsp;&nbsp;&nbsp;&middot;&nbsp;&nbsp;&nbsp;
                <span>{ square_feet } Sqft</span>
              </div>
            </div>
          </div>
        </div>
      )
    })
    // Listing list
    const listing_panel_list = listings.map((listing, i) => {
      const status_color = listing_util.getStatusColor(listing.status)
      let property = listing.compact_property
      let address = listing.address
      if (!property)
        property = listing.property
      if (!address)
        address = property.address
      let listing_image = <div style={ S('w-40 h-40 bg-efefef') }/>
      if (listing.cover_image_url)
        listing_image = <div style={ S('w-40 h-40 br-3 bg-url(' + listing.cover_image_url + ') bg-cover bg-center') } />
      const listing_style = S('pointer pl-10 h-60 pt-10 border-bottom-1-solid-f5fafe')
      const square_feet = helpers.numberWithCommas(Math.floor(listing_util.metersToFeet(property.square_meters)))
      let price = listing.price
      if (listing.close_price && user && user.user_type === 'Agent')
        price = listing.close_price
      const price_per_square_foot = Math.floor(price / listing_util.metersToFeet(property.square_meters))
      return (
        <div onMouseOut={ this.props.removeActiveListing.bind(this) } onMouseOver={ this.props.setActiveListing.bind(this, listing) } className="listing-panel__list-item" key={ 'panel-listing-list-' + listing.id + '-' + i} onClick={ this.props.showListingViewer.bind(this, listing) } style={ listing_style }>
          <div style={ S('pull-left') }>
            { data.show_listing_panel ? listing_image : '' }
          </div>
          <div style={ S('ml-10 pull-left w-220') }>
            <div style={ S('mb-5') }>{ listing_util.addressTitle(address) }</div>
            <div className="pull-left" style={ S('w-10 h-10 br-100 mr-8 bg-' + status_color) }></div>
            <div className="pull-left" style={ S('mt-4n font-12') }>
              { listing.status }
            </div>
          </div>
          <div className="pull-left" style={ S('mt-10 w-80') }>
            <div>{ address.postal_code }</div>
          </div>
          <div className="pull-left" style={ S('mt-10 w-100') }>
            <div>${ helpers.numberWithCommas(Math.floor(price)) }</div>
          </div>
          <div className="pull-left" style={ S('mt-10 w-60') }>
            <div>{ property.bedroom_count }</div>
          </div>
          <div className="pull-left" style={ S('mt-10 w-60') }>
            <div>{ property.bathroom_count }</div>
          </div>
          <div className="pull-left" style={ S('mt-10 w-60') }>
            <div>{ square_feet }</div>
          </div>
          <div className="pull-left" style={ S('mt-10 w-70') }>
            <div>${ price_per_square_foot }</div>
          </div>
          <div className="pull-left" style={ S('mt-10 w-70') }>
            <div>{ property.year_built }</div>
          </div>
          <div className="pull-left" style={ S('mt-10 w-70') }>
            <div>{ listing_util.getDOM(listing.dom) }</div>
          </div>
        </div>
      )
    })
    // Listing panel
    let heading_height = 150
    let panel_top = 90
    if (data.listing_panel && data.listing_panel.view === 'list') {
      panel_top = 123
      heading_height = 180
    }
    const listing_panel_wrap_style = S('fixed t-62 r-0 w-0 h-0 z-5')
    let listing_panel_style = S(`absolute t-0 w-425 bg-fff h-${window.innerHeight}`)
    let listing_scroll_style = {
      ...listing_panel_style,
      top: panel_top + 'px',
      height: window.innerHeight - heading_height + 10,
      overflowY: 'scroll'
    }
    // Go full (width) monty
    if (data.listing_panel && data.listing_panel.size === 'full') {
      listing_panel_style = {
        ...listing_panel_style,
        ...S(`w-${window.innerWidth - 70}`)
      }
      listing_scroll_style = {
        ...listing_scroll_style,
        ...S(`w-${window.innerWidth - 70}`)
      }
    }
    let panel_class = 'listing-panel'
    let button_class = 'listing-panel__button invisible'
    const listing_panel_icon = (
      <span className="close">&times;</span>
    )
    if (data.show_listing_panel) {
      panel_class = panel_class + ' active'
      button_class = 'listing-panel__button'
    }
    let panel_content_items = listing_panel_cards
    let items_heading
    if (!data.listing_panel || data.listing_panel && data.listing_panel.view === 'list') {
      panel_content_items = listing_panel_list
      items_heading = (
        <div style={ S('border-bottom-1-solid-e9eced pb-10 pl-10 fw-600 color-4a4a4a') }>
          <div style={ S('w-270 pull-left') }>
            Address
          </div>
          <div onClick={ this.props.sortListings.bind(this, 'area') } style={ S('w-80 pull-left pointer') }>
            Area&nbsp;&nbsp;
            <i style={ S('color-c3c3c3') } className="fa fa-caret-down"></i>
          </div>
          <div onClick={ this.props.sortListings.bind(this, 'price') } style={ S('w-100 pull-left pointer') }>
            Price&nbsp;&nbsp;
            <i style={ S('color-c3c3c3') } className="fa fa-caret-down"></i>
          </div>
          <div onClick={ this.props.sortListings.bind(this, 'bedroom_count') } style={ S('w-60 pull-left pointer') }>
            Beds&nbsp;&nbsp;
            <i style={ S('color-c3c3c3') } className="fa fa-caret-down"></i>
          </div>
          <div onClick={ this.props.sortListings.bind(this, 'bathroom_count') } style={ S('w-60 pull-left pointer') }>
            Baths&nbsp;&nbsp;
            <i style={ S('color-c3c3c3') } className="fa fa-caret-down"></i>
          </div>
          <div onClick={ this.props.sortListings.bind(this, 'square_meters') } style={ S('w-60 pull-left pointer') }>
            Sqft&nbsp;&nbsp;
            <i style={ S('color-c3c3c3') } className="fa fa-caret-down"></i>
          </div>
          <div onClick={ this.props.sortListings.bind(this, 'price_per_square_foot') } style={ S('w-70 pull-left pointer') }>
            $/Sqft&nbsp;&nbsp;
            <i style={ S('color-c3c3c3') } className="fa fa-caret-down"></i>
          </div>
          <div onClick={ this.props.sortListings.bind(this, 'year_built') } style={ S('w-70 pull-left pointer') }>
            Built&nbsp;&nbsp;
            <i style={ S('color-c3c3c3') } className="fa fa-caret-down"></i>
          </div>
          <div onClick={ this.props.sortListings.bind(this, 'dom') } style={ S('w-70 pull-left pointer') }>
            DOM&nbsp;&nbsp;
            <i style={ S('color-c3c3c3') } className="fa fa-caret-down"></i>
          </div>
          <div className="clearfix"></div>
        </div>
      )
    }
    const sortby_title = this.getSortingTitle()
    let button_style = S('absolute z-1 pt-8 pb-8 h-40 w-40 mr-0')
    if (data.show_listing_panel) {
      button_style = {
        ...button_style,
        right: 425
      }
    }
    let listing_panel_btn = (
      <Button onClick={ this.props.toggleListingPanel.bind(this) } className={ button_class } style={ button_style }>
        { listing_panel_icon }
      </Button>
    )
    if (data.is_mobile)
      listing_panel_btn = null
    let listings_total
    if (data.show_search_map) {
      if (listing_map.listings_info && listing_map.listings_info.total)
        listings_total = ' of ' + listing_map.listings_info.total
    }
    if (data.show_alerts_map) {
      if (data.alerts_map && data.alerts_map.listings_info)
        listings_total = ' of ' + data.alerts_map.listings_info.total
    }
    return (
      <div style={ listing_panel_wrap_style }>
        { listing_panel_btn }
        <div style={ listing_panel_style } className={ panel_class }>
          <div>
            <div style={ S('pt-10 pl-15 pr-15 mb-10') }>
              <div className="tempo" style={ S('color-444 fw-100 font-24') }>{ listings.length }{ listings_total } Homes</div>
              <div>
                Sorting by
                <DropdownButton bsStyle="link" title={ sortby_title || '' } id="dropdown-size-large">
                  <MenuItem onClick={ this.props.sortListings.bind(this, 'area') }>Area</MenuItem>
                  <MenuItem onClick={ this.props.sortListings.bind(this, 'price') }>Price</MenuItem>
                  <MenuItem onClick={ this.props.sortListings.bind(this, 'bedroom_count') }>Beds</MenuItem>
                  <MenuItem onClick={ this.props.sortListings.bind(this, 'bathroom_count') }>Baths</MenuItem>
                  <MenuItem onClick={ this.props.sortListings.bind(this, 'square_meters') }>Sqft</MenuItem>
                  <MenuItem onClick={ this.props.sortListings.bind(this, 'price_per_square_foot') }>$/Sqft</MenuItem>
                  <MenuItem onClick={ this.props.sortListings.bind(this, 'year_built') }>Built</MenuItem>
                  <MenuItem onClick={ this.props.sortListings.bind(this, 'dom') }>Dom</MenuItem>
                  <MenuItem onClick={ this.props.sortListings.bind(this, 'distance') }>Distance to map center</MenuItem>
                </DropdownButton>
              </div>
            </div>
            { items_heading }
          </div>
          <div style={ listing_scroll_style }>
            <div style={ S('m-0 p-0') }>
              { panel_content_items }
              <div className="clearfix"></div>
            </div>
          </div>
        </div>
      </div>
    )
  }
}
ListingPanel.propTypes = {
  data: React.PropTypes.object,
  toggleListingPanel: React.PropTypes.func,
  showListingViewer: React.PropTypes.func,
  sortListings: React.PropTypes.func,
  setActiveListing: React.PropTypes.func,
  removeActiveListing: React.PropTypes.func
}
