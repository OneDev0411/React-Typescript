import React from 'react'

import { Grid } from '@material-ui/core'
import { useSelector } from 'react-redux'

import useBrandAndDealsListings from '@app/hooks/use-brand-and-deals-listings'
import { selectActiveBrandId } from '@app/selectors/brand'
import CardSkeleton from 'components/CardSkeleton'
import ListingCard from 'components/ListingCards/ListingCard'
import { goTo } from 'utils/go-to'

import LinkSectionAction from '../LinkSectionAction'
import SectionLayout from '../SectionLayout'

export default function PromoteListingsSection() {
  const brandId = useSelector(selectActiveBrandId)

  const { listings, isLoading } = useBrandAndDealsListings(brandId)

  return (
    <SectionLayout
      title="Promote Your Listings"
      actionNode={
        <LinkSectionAction title="View all" url="/dashboard/listings" />
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
