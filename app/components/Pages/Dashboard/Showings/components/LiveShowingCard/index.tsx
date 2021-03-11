import React from 'react'

import { Box } from '@material-ui/core'

import ListingCard from 'components/ListingCards/ListingCard'
import { listing } from 'fixtures/listing/listing'
import Chip from 'components/Chip'

import LiveShowingCardButton from './LiveShowingCardButton'
import LiveShowingCardOnlineSwitch from './LiveShowingCardOnlineSwitch'

function LiveShowingCard() {
  return (
    <ListingCard
      listing={listing}
      customChip={<Chip color="red" label="2 Updates" variant="contained" />}
    >
      <Box
        p={1}
        display="flex"
        justifyContent="space-between"
        alignItems="center"
      >
        <LiveShowingCardButton />
        <LiveShowingCardOnlineSwitch />
      </Box>
    </ListingCard>
  )
}

export default LiveShowingCard
