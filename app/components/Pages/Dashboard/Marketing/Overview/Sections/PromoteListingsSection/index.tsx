import React from 'react'
import { useSelector } from 'react-redux'
import { Grid } from '@material-ui/core'

import { goTo } from 'utils/go-to'
import { getActiveTeamId } from 'utils/user-teams'
import { useLoadingEntities } from 'hooks/use-loading'
import { useBrandListings, useDealsListings } from 'hooks/use-listings'
import { selectUser } from 'selectors/user'

import CardSkeleton from 'components/CardSkeleton'
import ListingCard from 'components/ListingCards/ListingCard'

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
        <LinkSectionAction
          title="View all your listings"
          url="/dashboard/agent-network"
        />
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
          <Grid key={listing.id} item md={3}>
            <ListingCard
              hideFeatures
              listing={listing}
              onClick={() => {
                goTo(`/dashboard/marketing/wizard?listingId=${listing.id}`)
              }}
            />
          </Grid>
        ))}
    </SectionLayout>
  )
}
