import { useState, useEffect } from 'react'

import { Grid, Box, CircularProgress } from '@material-ui/core'

import getAgentListings from '@app/models/agent-network/get-agent-listings'
import ListingCard from 'components/ListingCards/ListingCard'
import Drawer from 'components/OverlayDrawer'
import { goTo } from 'utils/go-to'

import { AgentSide } from '../../types'

interface Props {
  agent: IAgent
  title: string
  side: AgentSide
  onClose: () => void
}

export default function AgentListingsDrawer({ agent, title, onClose }: Props) {
  const [listings, setListings] = useState<Nullable<ICompactListing[]>>(null)

  useEffect(() => {
    async function fetchAgentListings() {
      const fetchedListings = await getAgentListings(agent.id)

      setListings(fetchedListings)
    }

    fetchAgentListings()
  }, [agent.id])

  const handleListingClick = (listing: ICompactListing) => {
    goTo(`/dashboard/mls/${listing.id}`)
  }

  return (
    <Drawer open onClose={onClose}>
      <Drawer.Header title={title} />
      <Drawer.Body>
        <Box py={1}>
          <Grid container spacing={1}>
            {listings ? (
              listings.map(listing => (
                <Grid key={listing.id} item md={12} lg={6}>
                  <ListingCard
                    listing={listing}
                    onClick={() => handleListingClick(listing)}
                  />
                </Grid>
              ))
            ) : (
              <Grid
                container
                spacing={1}
                alignItems="center"
                justifyContent="center"
              >
                <Grid item>
                  <CircularProgress />
                </Grid>
              </Grid>
            )}
          </Grid>
        </Box>
      </Drawer.Body>
    </Drawer>
  )
}
