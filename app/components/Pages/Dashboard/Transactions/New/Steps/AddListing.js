// Dashboard/Transactions/New/Steps/AddListing.js
import React, { Component } from 'react'
import { Button, Input, Modal, Col } from 'react-bootstrap'
import S from 'shorti'
import _ from 'lodash'
import listing_util from '../../../../../../utils/listing'
import helpers from '../../../../../../utils/helpers'

export default class AddListing extends Component {

  setListingActive(direction) {
    const data = this.props.data
    const listings_found = data.new_transaction.listings_found
    let active_listing = -1

    // Prev active contact
    if (data.active_listing !== null)
      active_listing = data.new_transaction.active_listing

    if (direction === 'up') {
      if (active_listing > -1)
        active_listing = active_listing - 1
      else
        active_listing = listings_found.length - 1
    }

    if (direction === 'down') {
      if (active_listing < listings_found.length - 1)
        active_listing = active_listing + 1
      else
        active_listing = 0
    }
    this.props.setListingActive(active_listing)
  }

  searchListings(e) {
    // alpha-num and delete / backspace
    if (e.keyCode >= 48 && e.keyCode <= 57 || e.keyCode >= 65 && e.keyCode <= 90 || e.keyCode === 46 || e.keyCode === 8) {
      const q = this.refs.q.refs.input.value
      clearTimeout(window.is_typing_timeout)
      // Send stopped typing event
      window.is_typing_timeout = setTimeout(() => {
        if (q) this.props.searchListings(q)
      }, 200)
    }
  }

  navListingList(e) {
    if (e.which === 38)
      this.setListingActive('up')
    if (e.which === 40)
      this.setListingActive('down')
    if (e.which === 13) {
      const new_transaction = this.props.data.new_transaction
      const active_listing = new_transaction.active_listing
      const listings_found = new_transaction.listings_found
      this.addListing(listings_found[active_listing])
    }
  }

  addListing(listing) {
    const listings_found = this.props.data.new_transaction.listings_found
    this.refs.q.refs.input.value = ''
    this.props.addListing(listing)
    const listing_id = listing.id
    const listing_index = _.findIndex(listings_found, { id: listing_id })
    this.props.setListingActive(listing_index)
    this.setListingActive(listing_index)
    this.refs.q.refs.input.focus()
  }

  hideModal() {
    this.props.hideModal()
  }

  render() {
    // Data
    const data = this.props.data
    const new_transaction = data.new_transaction
    const active_listing = new_transaction.active_listing
    const listing_added = new_transaction.listing_added
    const listing_data = new_transaction.listing_data
    let listing_results
    let bg_color
    // Check listing matches query (because there's no fetch abort yet)
    const listing_q = data.new_transaction.listing_q
    let q
    if (this.refs.q)
      q = this.refs.q.refs.input.value
    if (listing_q === q && new_transaction.listings_found && new_transaction.listings_found.length) {
      const listings_found = new_transaction.listings_found
      const listing_list = listings_found.map((listing, i) => {
        bg_color = ''
        if (active_listing === i)
          bg_color = ' bg-EDF7FD'
        if (listing_added && listing_added.mls_number === listing.mls_number)
          bg_color = ' bg-dff0d8'

        let cover_image = <div style={ S('bg-929292 w-87 h-50 color-fff text-center pt-15') }>No Image</div>
        if (listing.cover_image_url) {
          cover_image = (
            <div style={ S(`w-87 h-50 bg-cover bg-center bg-url(${listing.cover_image_url})`) }></div>
          )
        }
        return (
          <div key={ listing.id } className="search-listings__listing" onClick={ this.addListing.bind(this, listing) } style={ S('br-3 h-62 relative pointer p-5 ' + bg_color) }>
            <div className="pull-left" style={ S('mr-10') }>{ cover_image }</div>
            <div style={ S('mt-5') } className="pull-left">
              <span style={ S('color-666') }>
                <span style={ S('mr-10') }><b>{ listing.address.street_number } { listing.address.street_name } { listing.address.street_suffix }</b></span>
                <span style={ S('mr-10 font-12 color-929292') }>
                  <span style={ S('font-20 t-5 absolute color-' + listing_util.getStatusColor(listing.status)) }>&#8226;</span>
                  <span style={ S('ml-12') }>{ listing.status }</span>
                </span>
                <br/>
                <span style={ S('color-929292 font-10') }>{ listing.address.city }, { listing.address.state }</span>
              </span>
            </div>
            <div className="clearfix"></div>
          </div>
        )
      })
      // Style
      const listing_scroll_area = {
        ...S('mt-10 p-5 bc-ccc bw-1 solid br-3'),
        maxHeight: 300,
        maxWidth: 600,
        overflow: 'scroll'
      }
      listing_results = <div className="search-listings" style={ listing_scroll_area }>{ listing_list }</div>
    }

    if (!new_transaction.listings_found && new_transaction.listing_q) {
      listing_results = (
        <div style={ S('p-10') }>
          No listings found
        </div>
      )
    }

    if (new_transaction.listing_searching) {
      listing_results = (
        <div style={ S('p-10') }>
          searching...
        </div>
      )
    }
    let listing_added_markup
    let listing_address
    let cover_image_url
    let listing_full_address
    if (listing_added || listing_data) {
      if (listing_added) {
        listing_address = listing_added.address.street_number + ' ' +
        listing_added.address.street_name + ' ' + listing_added.address.street_suffix
        listing_full_address = listing_address + ' ' + listing_added.address.city + ', ' + listing_added.address.state + ' ' + listing_added.address.postal_code
        cover_image_url = listing_added.cover_image_url
      }
      if (listing_data) {
        const property = listing_data.property
        listing_full_address = property.address.street_full + ' ' + property.address.city + ' ' + property.address.state + ' ' + property.address.postal_code
      }
      listing_added_markup = (
        <div style={ S('h-25 relative bg-3388ff br-100 color-fff p-3 pl-0 pr-10 mb-10 mr-10 pointer') } className="pull-left">
          <div onClick={ this.props.showListingModal.bind(this) } style={ S('w-25 h-25 bg-cover bg-url(' + cover_image_url + ') l-0 t-0 absolute br-100') }></div>
          <div style={ S('ml-30') }>
            <span onClick={ this.props.showListingModal.bind(this) }>{ listing_full_address }</span>&nbsp;&nbsp;<span onClick={ this.props.removeAddedListing.bind(this) } style={ S('pointer') }>x</span>
          </div>
        </div>
      )
    }
    let listing_image
    if (listing_added && listing_added.cover_image_url) {
      listing_image = (
        <div style={ S(`absolute w-100p h-100p bg-center bg-cover bg-url(${listing_added.cover_image_url})`) }></div>
      )
    } else {
      listing_image = (
        <div style={ S('absolute w-100p h-100p bg-center bg-cover bg-eff1f2 color-929292 pt-170 font-26 text-center') }>
          No image
        </div>
      )
    }
    const input_style = {
      border: 'none'
    }
    const row_style = {
      borderBottom: '1px solid #f3f3f3'
    }
    let square_feet
    if (listing_added)
      square_feet = helpers.numberWithCommas(Math.floor(listing_util.metersToFeet(listing_added.compact_property.square_meters)))
    return (
      <div>
        <div style={ S('absolute t-120n') }>
          <img style={ S('h-121') } src="/images/dashboard/transactions/house.png" />
        </div>
        <div style={ S('mb-20') }>
          <h1>We’re almost done! Do you have a property listing in mind?</h1>
        </div>
        <div style={ S('h-25') }>
          { listing_added_markup }
        </div>
        <div style={ S('maxw-820') }>
          <Input ref="q" onKeyDown={ this.navListingList.bind(this) } onKeyUp={ this.searchListings.bind(this) } className="pull-left" style={ S('w-600') } type="text" placeholder="Enter an address or MLS number"/>
          <span className="pull-left" style={ S('w-30 ml-15 mt-8 color-666') }>OR</span>
          <Button onClick={ this.props.showListingModal.bind(this, 'new') } className="pull-left" style={ S('w-160') } bsStyle="primary" type="button">
            Add New Property
          </Button>
          <Modal dialogClassName="property-modal" show={ data.new_transaction.show_listing_modal } onHide={ this.props.hideModal.bind(this) }>
            <form onSubmit={ this.props.addCustomListingInfo.bind(this) }>
              <Modal.Body style={ S('p-0') } className="flexbox">
                <Col xs={6} style={ S('p-0') }>
                  { listing_image }
                </Col>
                <Col xs={6} style={ S('p-0') }>
                  <Modal.Header closeButton style={ S('h-45 bc-f3f3f3') }>
                    <Modal.Title style={ S('font-14') }>Property Info</Modal.Title>
                  </Modal.Header>
                  <div style={ row_style }>
                    <Col xs={8} style={ S('pl-0 pr-0') }>
                      <label style={ S('p-10 mb-0 fw-400 color-bfc2c3') }>ADDRESS</label>
                      <input className="form-control" style={ input_style } type="text" ref="address" defaultValue={ listing_address }/>
                    </Col>
                    <Col xs={4} style={ S('pr-0') }>
                      <label style={ S('p-10 mb-0 fw-400 color-bfc2c3') }>STATUS</label>
                      <input className="form-control" style={ input_style } type="text" ref="status" defaultValue={ listing_added ? listing_added.status : '' }/>
                    </Col>
                    <div className="clearfix"></div>
                  </div>
                  <div style={ row_style }>
                    <Col xs={6} style={ S('pl-0') }>
                      <label style={ S('p-10 mb-0 fw-400 color-bfc2c3') }>CITY</label>
                      <input className="form-control" style={ input_style } type="text" ref="city" defaultValue={ listing_added ? listing_added.address.city : '' }/>
                    </Col>
                    <Col xs={3} style={ S('p-0') }>
                      <label style={ S('p-10 mb-0 fw-400 color-bfc2c3') }>STATE</label>
                      <input className="form-control" style={ input_style } type="text" ref="state" defaultValue={ listing_added ? listing_added.address.state : '' }/>
                    </Col>
                    <Col xs={3} style={ S('pr-0') }>
                      <label style={ S('p-10 mb-0 fw-400 color-bfc2c3') }>ZIP</label>
                      <input className="form-control" style={ input_style } type="text" ref="zip" defaultValue={ listing_added ? listing_added.address.postal_code : '' }/>
                    </Col>
                    <div className="clearfix"></div>
                  </div>
                  <div style={ row_style }>
                    <Col xs={6} style={ S('pl-0 pr-0') }>
                      <label style={ S('p-10 mb-0 fw-400 color-bfc2c3') }>YEAR BUILT</label>
                      <input className="form-control" style={ input_style } type="text" ref="year_built" defaultValue={ listing_added ? listing_added.compact_property.year_built : '' }/>
                    </Col>
                    <Col xs={6} style={ S('pr-0') }>
                      <label style={ S('p-10 mb-0 fw-400 color-bfc2c3') }>PROPERTY TYPE</label>
                      <input className="form-control" style={ input_style } type="text" ref="property_type" defaultValue={ listing_added ? listing_added.compact_property.postal_code : '' }/>
                    </Col>
                    <div className="clearfix"></div>
                  </div>
                  <div style={ row_style }>
                    <Col xs={4} style={ S('pl-0') }>
                      <label style={ S('p-10 mb-0 fw-400 color-bfc2c3') }>SQFT</label>
                      <input className="form-control" style={ input_style } type="text" ref="sqft" defaultValue={ square_feet }/>
                    </Col>
                    <Col xs={4} style={ S('p-0') }>
                      <label style={ S('p-10 mb-0 fw-400 color-bfc2c3') }>BEDS</label>
                      <input className="form-control" style={ input_style } type="text" ref="beds" defaultValue={ listing_added ? listing_added.compact_property.bedroom_count : '' }/>
                    </Col>
                    <Col xs={4} style={ S('pr-0') }>
                      <label style={ S('p-10 mb-0 fw-400 color-bfc2c3') }>BATHS</label>
                      <input className="form-control" style={ input_style } type="text" ref="baths" defaultValue={ listing_added ? listing_added.compact_property.full_bathroom_count : '' }/>
                    </Col>
                    <div className="clearfix"></div>
                  </div>
                  <div className="pull-right" style={ S('p-15 pb-10') }>
                    <Button bsStyle="link" onClick={ this.hideModal.bind(this) }>Cancel</Button>
                    <Button style={ S('h-30 pt-5 pl-30 pr-30') } className={ data.creating_property ? 'disabled' : '' } type="submit" bsStyle="primary">
                      { data.creating_property ? 'Adding...' : 'Add' }
                    </Button>
                  </div>
                  <div className="clearfix"></div>
                </Col>
                <div className="clearfix"></div>
              </Modal.Body>
            </form>
          </Modal>
        </div>
        <div className="clearfix"></div>
        { listing_results }
      </div>
    )
  }
}

// PropTypes
AddListing.propTypes = {
  data: React.PropTypes.object,
  searchListings: React.PropTypes.func,
  addListing: React.PropTypes.func,
  setListingActive: React.PropTypes.func,
  showListingModal: React.PropTypes.func,
  hideModal: React.PropTypes.func,
  addCustomListingInfo: React.PropTypes.func,
  removeAddedListing: React.PropTypes.func,
  removeAddedProperty: React.PropTypes.func
}