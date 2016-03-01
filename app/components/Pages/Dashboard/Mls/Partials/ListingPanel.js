// Partials/ListingPanel.js
import React, { Component } from 'react'
import { Button } from 'react-bootstrap'
import S from 'shorti'
import helpers from '../../../../../utils/helpers'
import listing_util from '../../../../../utils/listing'

export default class ListingPanel extends Component {
  render() {
    // Listing cards
    const data = this.props.data
    const listing_map = this.props.data.listing_map
    if (!listing_map || listing_map && !listing_map.listings)
      return <div></div>
    const listings = data.listing_map.listings
    const listing_panel_cards = listings.map(listing => {
      const status_color = listing_util.getStatusColor(listing.status)
      const property = listing.compact_property
      let listing_image = <div style={ S('w-405 h-300 bg-efefef') }/>
      if (listing.cover_image_url)
        listing_image = <div style={ S('w-405 h-300 bg-url(' + listing.cover_image_url + ') bg-cover bg-center') } />
      const square_feet = helpers.numberWithCommas(Math.floor(listing_util.metersToFeet(property.square_meters)))
      return (
        <div key={ 'panel-listing-' + listing.id } onClick={ this.props.showListingViewer.bind(this, listing) } style={ S('pointer w-415 h-350 pb-10 pl-10 bg-fff pull-left') } lat={ listing.location.latitude } lng={ listing.location.longitude } text={'A'}>
          <div style={ S('relative') }>
            { listing_image }
            <div style={ S('absolute color-fff l-15 b-15') }>
              <div style={ S('font-18 fw-600') }>
                ${ helpers.numberWithCommas(Math.floor(listing.price)) }
              </div>
              <div style={ S('font-14') }>
                { listing_util.addressTitle(listing.address) } | { listing.address.city } { listing.address.state }
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
          <div style={ { borderRight: '1px solid #e7e8e9', borderBottom: '1px solid #e7e8e9', borderLeft: '1px solid #e7e8e9', ...S('p-10 pt-14 w-100p') } }>
            <div>
              <div className="pull-left" style={ S('w-10 h-10 br-100 mr-8 bg-' + status_color) }></div>
              <div className="pull-left" style={ S('mt-4n') }>
                { listing.status }
              </div>
              <div className="clearfix"></div>
            </div>
          </div>
        </div>
      )
    })
    // Listing list
    const listing_panel_list = listings.map(listing => {
      const status_color = listing_util.getStatusColor(listing.status)
      let price_small = Math.floor(listing.price / 1000).toFixed(2).replace(/[.,]00$/, '')
      let letter = 'K'
      if (price_small > 1000) {
        price_small = (price_small / 1000).toFixed(2).replace(/[.,]00$/, '')
        letter = 'M'
      }
      let listing_image = <div style={ S('w-80 h-80 bg-efefef') }/>
      if (listing.cover_image_url)
        listing_image = <div style={ S('w-80 h-80 br-3 bg-url(' + listing.cover_image_url + ') bg-cover bg-center') } />
      const listing_style = {
        ...S('pointer w-400 pl-10 h-90 bg-fff mb-10 mt-10'),
        borderBottom: '1px solid #f5fafe'
      }
      return (
        <div key={ 'panel-listing-' + listing.id } onClick={ this.props.showListingViewer.bind(this, listing) } style={ listing_style } lat={ listing.location.latitude } lng={ listing.location.longitude } text={'A'}>
          <div style={ S('pull-left') }>
            { listing_image }
          </div>
          <div style={ S('p-10 pull-left w-200') }>
            <div style={ S('mb-10') }>{ listing_util.addressTitle(listing.address) }</div>
            <div className="pull-left" style={ S('w-10 h-10 br-100 mr-8 bg-' + status_color) }></div>
            <div className="pull-left" style={ S('mt-4n') }>
              { listing.status }
            </div>
          </div>
          <div className="pull-left" style={ S('mt-10 w-100') }>
            <div>${ price_small }{ letter }</div>
          </div>
        </div>
      )
    })
    // Listing panel
    let heading_height = 150
    let panel_top = 80
    if (data.listing_panel && data.listing_panel.view === 'list') {
      panel_top = 105
      heading_height = 180
    }
    const listing_panel_wrap_style = S('fixed t-62 r-0 w-0 h-0 z-100')
    const listing_panel_style = S('absolute t-0 w-850 bg-fff h-' + window.innerHeight)
    const listing_scroll_style = {
      ...listing_panel_style,
      top: panel_top + 'px',
      height: window.innerHeight - heading_height,
      overflowY: 'scroll'
    }
    let panel_class = 'listing-panel'
    let button_class = 'listing-panel__button'
    let listing_panel_icon = <i className="fa fa-chevron-left"></i>
    if (data.show_listing_panel) {
      panel_class = panel_class + ' active'
      button_class = button_class + ' active'
      listing_panel_icon = (
        <i className="fa fa-chevron-right"></i>
      )
    }
    let panel_content_items = listing_panel_cards
    let items_heading
    if (!data.listing_panel || data.listing_panel && data.listing_panel.view === 'list') {
      panel_content_items = listing_panel_list
      items_heading = (
        <div style={ { borderBottom: '1px solid #e9eced' } }>
          <div style={ S('pl-15 pr-15 mb-5') }>
            Address
          </div>
        </div>
      )
    }
    return (
      <div style={ listing_panel_wrap_style }>
        <Button onClick={ this.props.toggleListingPanel.bind(this) } className={ button_class } style={ S('absolute z-100 pt-8 pb-8 h-40 w-40 mr-0') }>
          { listing_panel_icon }
        </Button>
        <div style={ listing_panel_style } className={ panel_class }>
          <div>
            <div style={ S('pt-10 pl-15 pr-15 mb-10') }>
              <div className="tempo" style={ S('color-444 fw-100 font-24') }>{ listings.length } Homes Found</div>
              <div>Sorting by <a href="#">Most Relevant</a></div>
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

// PropTypes
ListingPanel.propTypes = {
  data: React.PropTypes.object,
  toggleListingPanel: React.PropTypes.func,
  showListingViewer: React.PropTypes.func
}