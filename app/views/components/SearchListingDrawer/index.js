import React from 'react'
import PropTypes from 'prop-types'

import _ from 'underscore'

import Deal from '../../../models/Deal'
import Listing from '../../../models/listings/listing'
import listingsHelper from '../../../utils/listing'

import SearchDrawer from '../SearchDrawer'
import ListingItem from './ListingItem'

class SearchListingDrawer extends React.Component {
  state = {
    isWorking: false
  }

  handleSelectListings = async items => {
    this.setState({
      isWorking: true
    })

    try {
      const listings = await Promise.all(
        _.map(items, item => {
          const id = item.type === 'deal' ? item.listing : item.id

          return Listing.getListing(id)
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

  searchListing = async value => {
    const response = await Deal.searchListings(value)

    const listings = response
      .map(item => ({
        id: item.id,
        full_address: listingsHelper.addressTitle(item.address),
        address_components: item.address,
        price: item.price,
        status: item.status,
        image: item.cover_image_url,
        gallery_image_urls: item.gallery_image_urls,
        is_mls_search: item.is_mls_search || false
      }))
      .filter(
        item =>
          item.is_mls_search ||
          item.status.includes('Active') ||
          ['Pending', 'Leased'].includes(item.status)
      )

    return listings
  }

  render() {
    return (
      <SearchDrawer
        showLoadingIndicator={this.state.isWorking}
        multipleSelection={this.props.multipleSelection}
        searchInputOptions={{
          placeholder: this.props.searchPlaceholder,
          debounceTime: 500,
          minimumLength: 3
        }}
        searchFunction={this.searchListing}
        ItemRow={ListingItem}
        onSelectItems={this.handleSelectListings}
        {...this.props}
      />
    )
  }
}

SearchListingDrawer.propTypes = {
  compact: PropTypes.bool,
  onSelectListing: PropTypes.func.isRequired,
  searchPlaceholder: PropTypes.string
}

SearchListingDrawer.defaultProps = {
  compact: true,
  searchPlaceholder: 'Enter MLS # or address'
}

export default SearchListingDrawer
