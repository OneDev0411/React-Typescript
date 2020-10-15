import React from 'react'
import { Box } from '@material-ui/core'

import Drawer from 'components/OverlayDrawer'
import CompactListingCard from 'components/ListingCards/CompactListingCard'

import { CompactListingWitgBothSideAgents } from '../../types'

interface Props {
  listings: CompactListingWitgBothSideAgents[]
  title: string
  onClose: () => void
}

export function ListingsDrawer({ listings, title, onClose }: Props) {
  return (
    <Drawer open onClose={onClose}>
      <Drawer.Header title={title} />
      <Drawer.Body>
        {listings.map(listing => (
          <Box my={1} key={listing.id}>
            <CompactListingCard listing={listing} />
          </Box>
        ))}
      </Drawer.Body>
    </Drawer>
  )
}
