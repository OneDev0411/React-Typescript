import React from 'react'
import TonyListing from './TonyListing'
import ListingViewerMobile from '../../../Partials/ListingViewerMobile'

const ListingModal = ({
  data,
  listing,
  isFetching
}) => {
  let modal = (
    <TonyListing
      listing={listing}
      isFetching={isFetching}
    />
  )

  // Check for mobile
  if (data.is_mobile) {
    listing_viewer = (
      <ListingViewerMobile
        data={data}
        listing={listing}
        isFetching={isFetching}
      />
    )
  }

  return modal
}

export default ListingModal