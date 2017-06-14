import React from 'react'
import ListingMobileView from './ListingMobileView'
import ListingDesktopView from './ListingDesktopView'

const ListingModal = ({ data, listing, isFetching }) => {
  let content = <ListingDesktopView listing={listing} isFetching={isFetching} />

  // Check for mobile
  if (data.is_mobile) {
    console.log('mobile')
    content = <ListingMobileView listing={listing} isFetching={isFetching} />
  }

  return content
}

export default ListingModal
