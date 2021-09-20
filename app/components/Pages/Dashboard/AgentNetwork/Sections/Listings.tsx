import { Grid, Box, Typography } from '@material-ui/core'

import ListingCard from 'components/ListingCards/ListingCard'
import LoadingContainer from 'components/LoadingContainer'

import { AgentNetworksZeroState } from './ZeroState'

interface Props {
  isLoading: boolean
  listings: Nullable<(ICompactListing | IListing)[]>
  onSelectListing: (listing: ICompactListing | IListing) => void
}

export default function Listings({
  isLoading,
  listings,
  onSelectListing
}: Props) {
  return (
    <>
      <Typography variant="h6">View Top Agents For Your Listings</Typography>
      <Box py={4} display="flex" flexDirection="column">
        <Grid container spacing={3}>
          {isLoading && (
            <Grid container item xs alignItems="center" justifyContent="center">
              <LoadingContainer noPaddings />
            </Grid>
          )}
          {listings?.map(listing => (
            <Grid key={listing.id} container item xs={12} sm={6} md={4}>
              <ListingCard
                listing={listing}
                onClick={() => onSelectListing(listing)}
              />
            </Grid>
          ))}
        </Grid>
        {!isLoading && listings?.length === 0 && <AgentNetworksZeroState />}
      </Box>
    </>
  )
}
