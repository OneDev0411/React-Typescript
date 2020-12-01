import React from 'react'
import { Grid, Box } from '@material-ui/core'

import Drawer from 'components/OverlayDrawer'
import ListingCard from 'components/ListingCards/ListingCard'

import { CompactListingWithBothSideAgents } from '../../types'

interface Props {
  listings: CompactListingWithBothSideAgents[]
  title: string
  onClose: () => void
}

export function ListingsDrawer({ listings, title, onClose }: Props) {
  return (
    <Drawer open onClose={onClose}>
      <Drawer.Header title={title} />
      <Drawer.Body>
        <Box py={1}>
          <Grid container spacing={1}>
            {listings.map(listing => (
              <Grid key={listing.id} item md={12} lg={6}>
                <ListingCard listing={listing} />
              </Grid>
            ))}
          </Grid>
        </Box>
      </Drawer.Body>
    </Drawer>
  )
}
