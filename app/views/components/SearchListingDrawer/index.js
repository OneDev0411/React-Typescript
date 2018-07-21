import React from 'react'
import PropTypes from 'prop-types'

import Deal from '../../../models/Deal'
import Listing from '../../../models/listings/listing'
import listingsHelper from '../../../utils/listing'

import SearchDrawer from '../SearchDrawer'
import ListingItem from './ListingItem'

class SearchListingDrawer extends React.Component {
  constructor(props) {
    super(props)
    this.handleSelectListing = this.handleSelectListing.bind(this)
  }

  state = {
    isWorking: false
  }

  async handleSelectListing(listing) {
    const { onSelectListing, compact } = this.props

    if (compact !== false) {
      return onSelectListing(listing)
    }

    this.setState({
      isWorking: true
    })

    try {
      const listingWithImages = await Listing.getListing(listing.id)

      onSelectListing(listingWithImages)
    } catch (e) {
      console.log(e)
      onSelectListing(listing)
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
        searchInputOptions={{
          placeholder: 'Enter MLS # or address',
          debounceTime: 500,
          minimumLength: 3
        }}
        searchFunction={this.searchListing}
        ItemRow={ListingItem}
        onSelectItem={this.handleSelectListing}
        {...this.props}
      />
    )
  }
}

SearchListingDrawer.propTypes = {
  compact: PropTypes.bool,
  onSelectListing: PropTypes.func.isRequired
}

SearchListingDrawer.defaultProps = {
  compact: true
}

export default SearchListingDrawer
