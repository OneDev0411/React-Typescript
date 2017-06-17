import React from 'react'
import ListingCard from './ListingCard'

const GridView = ({ listings, ...rest }) =>
  <div>
    {(listings.data.length &&
      listings.data.map(listing =>
        <ListingCard key={listing.id} listing={listing} {...rest} />
      )) ||
      ''}
  </div>

export default GridView
