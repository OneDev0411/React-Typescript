import React from 'react'
import ListingMobileView from './ListingMobileView'
import ListingDesktopView from './ListingDesktopView'

const ListingView = ({ data, listing, isFetching }) => {
  let content = <ListingDesktopView listing={listing} isFetching={isFetching} data={data} />

  // Check for mobile
  if (data.is_mobile) {
    content = <ListingMobileView listing={listing} isFetching={isFetching} data={data} />
  }

  return content
}

export default ListingView
