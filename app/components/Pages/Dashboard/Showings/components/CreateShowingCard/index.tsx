import React from 'react'

import { CardActions } from '@material-ui/core'

import ListingCard from 'components/ListingCards/ListingCard'
import { listing } from 'fixtures/listing/listing'

import LinkButton from '../LinkButton'

function CreateShowingCard() {
  return (
    <ListingCard listing={listing} hideFeatures>
      <CardActions>
        <LinkButton
          size="small"
          variant="outlined"
          to="/dashboard/showings/create"
        >
          Create Showing
        </LinkButton>
      </CardActions>
    </ListingCard>
  )
}

export default CreateShowingCard
