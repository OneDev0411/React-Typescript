import React from 'react'

import ListingCard from 'components/ListingCards/ListingCard'
import { listing } from 'fixtures/listing/listing'

function CreateShowingCard() {
  return <ListingCard listing={listing} />
}

export default CreateShowingCard
