import React from 'react'
import PropTypes from 'prop-types'
import _ from 'underscore'

import Deal from '../../../models/Deal'
import Listing from '../../../models/listings/listing'

import SearchDrawer from '../SearchDrawer'
import ListingItem from './ListingItem'

function addDealDataToListing(deal, listing) {
  return {
    ...listing,
    price: Deal.get.field(deal, 'list_price') || listing.price,
    property: {
      ...listing.property,
      address: {
        ...listing.property.address,
        city: Deal.get.field(deal, 'city') || listing.property.address.city,
        state: Deal.get.field(deal, 'state') || listing.property.address.state,
        full_address:
          Deal.get.field(deal, 'full_address') ||
          listing.property.address.full_address,
        street_address:
          Deal.get.field(deal, 'street_address') ||
          listing.property.address.street_address,
        unit_number:
          Deal.get.field(deal, 'unit_number') ||
          listing.property.address.unit_number,
        street_name:
          Deal.get.field(deal, 'street_name') ||
          listing.property.address.street_name,
        street_number:
          Deal.get.field(deal, 'street_number') ||
          listing.property.address.street_number,
        street_suffix:
          Deal.get.field(deal, 'street_suffix') ||
          listing.property.address.street_suffix,
        postal_code:
          Deal.get.field(deal, 'postal_code') ||
          listing.property.address.postal_code
      },
      list_date: Deal.get.field(deal, 'list_date') || listing.list_date,
      status: Deal.get.field(deal, 'listing_status') || listing.status,
      year_built:
        Deal.get.field(deal, 'year_built') || listing.property.year_built
    }
  }
}

class SearchListingDrawer extends React.Component {
  state = {
    isWorking: false
  }

  handleSelectListings = async items => {
    this.setState({
      isWorking: true
    })

    try {
      const { mockListings } = this.props
      const mockedMLSData = mockListings
        ? await import('./mock_listing.json')
        : null

      const listings = await Promise.all(
        _.map(items, item => {
          if (item.gallery_image_urls) {
            return item
          }

          const listing = item.type === 'deal' ? item.listing : item.id

          if (mockListings && !listing) {
            return addDealDataToListing(item, mockedMLSData)
          }

          return Listing.getListing(listing)
        })
      )

      this.props.onSelectListings(listings)
    } catch (e) {
      console.log(e)
    } finally {
      this.setState({
        isWorking: false
      })
    }
  }

  normalizeSelectedItem = item => ({
    ...item,
    id: item.type === 'deal' && item.listing ? item.listing : item.id
  })

  searchListing = async value => {
    const response = await Deal.searchListings(value)

    return response.filter(
      item =>
        item.is_mls_search ||
        ['Pending', 'Leased', 'Active'].includes(item.status)
    )
  }

  render() {
    return (
      <SearchDrawer
        title={this.props.title}
        showLoadingIndicator={this.state.isWorking}
        multipleSelection={this.props.multipleSelection}
        searchInputOptions={{
          placeholder: this.props.searchPlaceholder,
          debounceTime: 500,
          minimumLength: 3
        }}
        ItemRow={ListingItem}
        normalizeSelectedItem={this.normalizeSelectedItem}
        searchFunction={this.searchListing}
        onSelectItems={this.handleSelectListings}
        {...this.props}
      />
    )
  }
}

SearchListingDrawer.propTypes = {
  searchPlaceholder: PropTypes.string,
  mockListings: PropTypes.bool
}

SearchListingDrawer.defaultProps = {
  searchPlaceholder: 'Enter MLS # or address',
  mockListings: false
}

export default SearchListingDrawer
