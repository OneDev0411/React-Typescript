import { Grid, Typography } from '@material-ui/core'
import { useSelector } from 'react-redux'

import useBrandAndDealsListings from '@app/hooks/use-brand-and-deals-listings'
import { selectActiveBrandId } from '@app/selectors/brand'
import Link from '@app/views/components/ALink'
import CardSkeleton from '@app/views/components/CardSkeleton'
import ListingCard from '@app/views/components/ListingCards/ListingCard'

import LinkSectionAction from '../LinkSectionAction'
import SectionLayout from '../SectionLayout'

interface Props {
  title?: string
  emptyListing?: string
}

export default function PromoteListingsSection(props: Props) {
  const { title = 'Promote Your Listings', emptyListing = 'No listing yet!' } =
    props
  const brandId = useSelector(selectActiveBrandId)

  const { listings, isLoading } = useBrandAndDealsListings(brandId)

  return (
    <SectionLayout
      title={title}
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
            <Link
              noStyle
              to={`/dashboard/marketing/mls/${listing.id}`}
              target="_blank"
            >
              <ListingCard hideFeatures listing={listing} />
            </Link>
          </Grid>
        ))}

      {!isLoading && listings.length === 0 && (
        <Grid item xs={12}>
          <Typography variant="body1" color="textSecondary">
            {emptyListing}
          </Typography>
        </Grid>
      )}
    </SectionLayout>
  )
}
