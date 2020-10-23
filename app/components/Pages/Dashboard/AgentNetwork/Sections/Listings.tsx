import React from 'react'
import { Grid, Box, Typography } from '@material-ui/core'

import CompactListingCard from 'components/ListingCards/CompactListingCard'
import LoadingContainer from 'components/LoadingContainer'
import ListingsAndPlacesSearchInput from 'components/ListingsAndPlacesSearchInput'
import { SearchResult } from 'components/ListingsAndPlacesSearchInput/types'

interface Props {
  isLoading: boolean
  listings: Nullable<ICompactListing[]>
  onSelectListing: (listing: ICompactListing) => void
  onSelectPlace: (place: google.maps.GeocoderResult) => void
}

export default function Listings({
  isLoading,
  listings,
  onSelectListing,
  onSelectPlace
}: Props) {
  function handleSelectResult(result: SearchResult) {
    if (result.type === 'listing') {
      onSelectListing(result.listing)
    }

    if (result.type === 'place') {
      onSelectPlace(result.place)
    }
  }

  return (
    <>
      <Grid container direction="row" justify="space-between">
        <Grid item xs={12} sm={6} md={8}>
          <Grid item>
            <Typography variant="h6">
              View Top Agents For Your Listings
            </Typography>
          </Grid>
          <Grid item>
            <Typography variant="body2">
              Search for an address or MLS# or select from your current listings
            </Typography>
          </Grid>
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <ListingsAndPlacesSearchInput onSelect={handleSelectResult} />
        </Grid>
      </Grid>
      <Box py={2}>
        <Grid container spacing={3}>
          {isLoading && (
            <Grid container item xs alignItems="center" justify="center">
              <LoadingContainer noPaddings />
            </Grid>
          )}
          {listings?.map(listing => (
            <Grid key={listing.id} container item xs={12} sm={6} md={4}>
              <CompactListingCard
                listing={listing}
                onClick={() => onSelectListing(listing)}
              />
            </Grid>
          ))}
          {listings?.length === 0 && (
            <Grid
              container
              item
              direction="column"
              alignItems="center"
              justify="center"
            >
              <Box my={2}>
                <img
                  src="/static/images/contacts/zero-state.svg"
                  alt="houston"
                  style={{ marginBottom: '1rem' }}
                />
              </Box>
              <Typography variant="h5" align="center">
                You don't have any listings. <br />
                You can try searching an area or a listing.
              </Typography>
            </Grid>
          )}
        </Grid>
      </Box>
    </>
  )
}
