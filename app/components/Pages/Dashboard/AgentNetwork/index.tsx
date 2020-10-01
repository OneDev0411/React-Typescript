import React, { useState, useEffect } from 'react'
import { useSelector } from 'react-redux'
import { withRouter } from 'react-router'
import { useTitle } from 'react-use'
import { Box, Grid, Typography } from '@material-ui/core'

import { IAppState } from 'reducers'
import { ACL } from 'constants/acl'
import { getActiveTeamId } from 'utils/user-teams'
import { getBrandListings } from 'models/listings/search/get-brand-listings'
import { useLoadingEntities } from 'hooks/use-loading'

import Acl from 'components/Acl'
import PageLayout from 'components/GlobalPageLayout'
import CompactListingCard from 'components/ListingCards/CompactListingCard'
import LoadingContainer from 'components/LoadingContainer'

import Listings from './Sections/Listings'

export function AgentNetwork() {
  useTitle('Agent Network | Rechat')

  const user = useSelector<IAppState, IUser>(state => state.user)
  const [listings, setListings] = useState<Nullable<ICompactListing[]>>(null)
  const [isLoading, setIsLoading] = useLoadingEntities(listings)
  const brand = getActiveTeamId(user)

  useEffect(() => {
    async function fetchBrandListings() {
      if (!brand) {
        return
      }

      try {
        const brandListings = await getBrandListings(brand)

        setListings(brandListings)
      } catch (error) {
        setIsLoading(false)
        console.error(error)
      }
    }
    fetchBrandListings()
  }, [brand, setIsLoading])

  return (
    <Acl access={[ACL.MARKETING]}>
      <PageLayout>
        <PageLayout.Header title="Agent Network" />
        <PageLayout.Main>
          <Listings onSeeAllClick={console.log} />
          <Box py={2}>
            <Grid container spacing={3}>
              {isLoading && (
                <Grid container item xs alignItems="center" justify="center">
                  <LoadingContainer noPaddings />
                </Grid>
              )}
              {listings?.map(listing => (
                <Grid key={listing.id} container item xs={12} sm={6} md={4}>
                  <CompactListingCard listing={listing} onClick={console.log} />
                </Grid>
              ))}
              {listings?.length === 0 && (
                <Grid container item xs alignItems="center" justify="center">
                  <Typography variant="h2">
                    You don't have any listing to use.
                  </Typography>
                </Grid>
              )}
            </Grid>
          </Box>
        </PageLayout.Main>
      </PageLayout>
    </Acl>
  )
}

export default withRouter(AgentNetwork)
