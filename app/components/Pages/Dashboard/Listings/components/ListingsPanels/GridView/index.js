import React from 'react'
import ListingCard from './ListingCard'

const GridView = ({ listings, ...rest }) => (
  <div>
    {(listings.data.length &&
      listings.data.map((listing, index) => (
        <ListingCard
          listing={listing}
          key={`${rest.activePanel}_PANEL_LIST_ITEM_${index}`}
          {...rest}
        />
      ))) ||
      ''}
  </div>
)

export default GridView
