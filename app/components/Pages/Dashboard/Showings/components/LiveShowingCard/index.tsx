import React from 'react'

import ListingCard from 'components/ListingCards/ListingCard'
import { listing } from 'fixtures/listing/listing'

function LiveShowingCard() {
  return <ListingCard listing={listing} />
}

export default LiveShowingCard
