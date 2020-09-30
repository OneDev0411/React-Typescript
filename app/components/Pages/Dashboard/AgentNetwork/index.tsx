import React, { useState, useEffect } from 'react'
import { useSelector } from 'react-redux'
import { withRouter } from 'react-router'
import { useTitle } from 'react-use'
import { Grid } from '@material-ui/core'

import { IAppState } from 'reducers'
import { ACL } from 'constants/acl'
import { getActiveTeamId } from 'utils/user-teams'
import { getBrandListings } from 'models/listings/search/get-brand-listings'

import Acl from 'components/Acl'
import PageLayout from 'components/GlobalPageLayout'
import CompactListingCard from 'components/ListingCards/CompactListingCard'

import Listings from './Sections/Listings'

export function AgentNetwork() {
  useTitle('Agent Network | Rechat')

  const user = useSelector<IAppState, IUser>(state => state.user)
  const [listings, setListings] = useState<ICompactListing[]>([])
  const brand = getActiveTeamId(user)

  useEffect(() => {
    async function fetchBrandListings() {
      if (!brand) {
        return
      }

      const brandListings = await getBrandListings(brand)

      setListings(brandListings)
    }
    fetchBrandListings()
  }, [brand])

  return (
    <Acl access={[ACL.MARKETING]}>
      <PageLayout>
        <PageLayout.Header title="Agent Network" />
        <PageLayout.Main>
          <Listings onSeeAllClick={console.log} />
          <br />
          <Grid container spacing={3}>
            {listings.map(listing => (
              <Grid key={listing.id} container item xs={12} sm={6} md={4}>
                <CompactListingCard listing={listing} onClick={console.log} />
              </Grid>
            ))}
          </Grid>
        </PageLayout.Main>
      </PageLayout>
    </Acl>
  )
}

export default withRouter(AgentNetwork)
