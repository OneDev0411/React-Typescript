import React from 'react'
import { useSelector } from 'react-redux'
import { Grid } from '@material-ui/core'

import { getActiveTeamId } from 'utils/user-teams'
import { useLoadingEntities } from 'hooks/use-loading'
import { useBrandListings, useDealsListings } from 'hooks/use-listings'
import { selectUser } from 'selectors/user'

import Link from 'components/ALink'
import LoadingContainer from 'components/LoadingContainer'

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

  if (isLoadingBrandListings || isLoadingDealsListings) {
    return <LoadingContainer noPaddings />
  }

  const listings =
    dealsListings && brandListings ? [...dealsListings, ...brandListings] : null

  return (
    <SectionLayout
      title="Promote Your Listings"
      actionNode={
        <LinkSectionAction
          title="View all your listings"
          url="/dashboard/marketing/designs"
        />
      }
    >
      {listings?.slice(0, 4).map(listing => {
        const listingAddress =
          listing.type === 'compact_listing'
            ? listing.address
            : listing.property.address

        return (
          <Grid key={listing.id} item md={3}>
            <Link
              noStyle
              to={`/dashboard/agent-network/agents?listing=${listing.id}&title=${listingAddress.street_address}`}
            >
              <ListingCard hideFeatures listing={listing} />
            </Link>
          </Grid>
        )
      })}
    </SectionLayout>
  )
}
