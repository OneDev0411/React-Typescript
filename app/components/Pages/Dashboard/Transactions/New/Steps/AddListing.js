// Dashboard/Transactions/New/Steps/AddListing.js
import React, { Component } from 'react'
import { Button, Input } from 'react-bootstrap'
import S from 'shorti'

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
    const new_transaction = this.props.data.new_transaction
    if (new_transaction.listing_searching)
      return false
    // alpha-num and delete / backspace
    if (e.keyCode >= 48 && e.keyCode <= 57 || e.keyCode >= 65 && e.keyCode <= 90 || e.keyCode === 46 || e.keyCode === 8) {
      const q = this.refs.q.refs.input.value
      this.props.searchListings(q)
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
    this.props.addListing(listing)
  }

  render() {
    // Data
    const data = this.props.data
    const new_transaction = data.new_transaction
    const active_listing = new_transaction.active_listing
    const listing_added = new_transaction.listing_added
    let listing_results
    let bg_color
    if (new_transaction.listings_found && new_transaction.listings_found.length) {
      const listings_found = new_transaction.listings_found
      const listing_list = listings_found.map((listing, i) => {
        bg_color = ''
        if (active_listing === i)
          bg_color = ' bg-EDF7FD'
        if (listing_added && listing_added.mls_number === listing.mls_number)
          bg_color = ' bg-dff0d8'

        return (
          <div key={ listing.id } className="search-listings__listing" onClick={ this.addListing.bind(this, listing) } style={ S('br-3 relative pointer mb-5 p-10 ' + bg_color) }>
            <div>
              <span style={ S('color-666') }>
                Address: { listing.address.street_number } { listing.address.street_name } { listing.address.street_suffix } { listing.address.city }, { listing.address.state }<br/>
                Price: { listing.price }<br/>
                Type: { listing.status }<br/>
                MLS: { listing.mls_number }
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

    return (
      <div>
        <img style={ S('h-121') } src="/images/dashboard/transactions/house.png" />
        <div style={ S('mb-40') }>
          <h1>We’re almost done! Do you have a property listing in mind?</h1>
        </div>
        <div style={ S('maxw-820') }>
          <Input ref="q" onKeyDown={ this.navListingList.bind(this) } onKeyUp={ this.searchListings.bind(this) } className="pull-left" style={ S('w-640') } type="text" placeholder="Enter an address or MLS number"/>
          <Button className="pull-left" style={ S('w-160 ml-10') } bsStyle="primary" type="button">Add New Property</Button>
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
  setListingActive: React.PropTypes.func
}