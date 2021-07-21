import React from 'react'

import { Grid } from '@material-ui/core'
import { useSelector } from 'react-redux'

import CardSkeleton from 'components/CardSkeleton'
import ListingCard from 'components/ListingCards/ListingCard'
import { useBrandListings, useDealsListings } from 'hooks/use-listings'
import { useLoadingEntities } from 'hooks/use-loading'
import { selectUser } from 'selectors/user'
import { goTo } from 'utils/go-to'
import { getActiveTeamId } from 'utils/user-teams'

import LinkSectionAction from '../LinkSectionAction'
import SectionLayout from '../SectionLayout'

export default function PromoteListingsSection() {
  const user = useSelector(selectUser)

  const brand = getActiveTeamId(user)
  const brandListings = useBrandListings(brand)
  const brandListingsIds = brandListings?.map(listing => listing.id)
  const dealsListings = useDealsListings(brandListingsIds)
  const [isLoadingBrandListings] = useLoadingEntities(brandListings)
  const [isLoadingDealsListings] = useLoadingEntities(dealsListings)

  const isLoading = isLoadingBrandListings || isLoadingDealsListings

  const listings =
    dealsListings && brandListings ? [...dealsListings, ...brandListings] : null

  return (
    <SectionLayout
      title="Promote Your Listings"
      actionNode={
        <LinkSectionAction title="View all" url="/dashboard/agent-network" />
      }
    >
      {isLoading && (
        <>
          <Grid item md={3}>
            <CardSkeleton style={{ height: '293px' }} />
          </Grid>
          <Grid item md={3}>
            <CardSkeleton style={{ height: '293px' }} />
          </Grid>
          <Grid item md={3}>
            <CardSkeleton style={{ height: '293px' }} />
          </Grid>
          <Grid item md={3}>
            <CardSkeleton style={{ height: '293px' }} />
          </Grid>
        </>
      )}
      {!isLoading &&
        listings?.slice(0, 4).map(listing => (
          <Grid key={listing.id} item xs={12} sm={6} md={3}>
            <ListingCard
              hideFeatures
              listing={listing}
              onClick={() => {
                goTo(`/dashboard/mls/${listing.id}/marketing`)
              }}
            />
          </Grid>
        ))}
    </SectionLayout>
  )
}
