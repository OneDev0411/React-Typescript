import React from 'react'

import { CardActions, Button } from '@material-ui/core'

import ListingCard from 'components/ListingCards/ListingCard'
import { listing } from 'fixtures/listing/listing'

function CreateShowingCard() {
  const handleClick = () => {
    // TODO: implement this function
    console.log('CreateShowingCard::click')
  }

  return (
    <ListingCard listing={listing} hideFeatures>
      <CardActions>
        <Button size="small" variant="outlined" onClick={handleClick}>
          Create Showing
        </Button>
      </CardActions>
    </ListingCard>
  )
}

export default CreateShowingCard
