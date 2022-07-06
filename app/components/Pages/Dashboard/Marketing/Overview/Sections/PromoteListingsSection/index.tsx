import { Grid } from '@material-ui/core'

import useBrandAndDealsListings from '@app/hooks/use-brand-and-deals-listings'
import Link from '@app/views/components/ALink'
import CardSkeleton from '@app/views/components/CardSkeleton'
import ListingCard from '@app/views/components/ListingCards/ListingCard'

import LinkSectionAction from '../LinkSectionAction'
import SectionLayout from '../SectionLayout'

export default function PromoteListingsSection() {
  const { listings, isLoading } = useBrandAndDealsListings()

  return (
    <SectionLayout
      title="Promote Your Listings"
      actionNode={
        <LinkSectionAction
          title="View all your listings"
          url="/dashboard/listings"
        />
      }
      headerGridProps={{ justifyContent: 'space-between' }}
    >
      {isLoading && (
        <>
          <Grid item xs={12} sm={6} md={3}>
            <CardSkeleton style={{ height: '293px' }} />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <CardSkeleton style={{ height: '293px' }} />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <CardSkeleton style={{ height: '293px' }} />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <CardSkeleton style={{ height: '293px' }} />
          </Grid>
        </>
      )}
      {!isLoading &&
        listings?.slice(0, 4).map(listing => (
          <Grid key={listing.id} item xs={12} sm={6} md={3}>
            <Link
              noStyle
              to={`/dashboard/marketing/mls/${listing.id}`}
              target="_blank"
            >
              <ListingCard hideFeatures listing={listing} />
            </Link>
          </Grid>
        ))}
    </SectionLayout>
  )
}
