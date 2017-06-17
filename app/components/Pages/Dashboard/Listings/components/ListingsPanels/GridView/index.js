import React from 'react'
import ListingCard from './ListingCard'

const GridView = ({ ...rest }) => {
  const { data, listings, activePanel, tabName } = rest

  return (
    <div>
      {(listings.data.length &&
        listings.data.map(listing =>
          <ListingCard key={listing.id} listing={listing} user={data.user} />
        )) ||
        ''}
    </div>
  )
}

export default GridView
