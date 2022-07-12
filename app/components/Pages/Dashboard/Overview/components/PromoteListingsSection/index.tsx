import { useRef } from 'react'

import { Box, Button, Grid } from '@material-ui/core'
import { makeStyles, Theme } from '@material-ui/core/styles'
import { mdiPlus } from '@mdi/js'

import { EmptyState } from '@app/components/Pages/Dashboard/Overview/components/EmptyState'
import useBrandAndDealsListings from '@app/hooks/use-brand-and-deals-listings'
import { goTo } from '@app/utils/go-to'
import Link from '@app/views/components/ALink'
import CardSkeleton from '@app/views/components/CardSkeleton'
import ListingCard from '@app/views/components/ListingCards/ListingCard'
import { muiIconSizes } from '@app/views/components/SvgIcons/icon-sizes'
import { SvgIcon } from '@app/views/components/SvgIcons/SvgIcon'

import LinkSectionAction from '../LinkSectionAction'
import SectionLayout from '../SectionLayout'

const useStyles = makeStyles(
  (theme: Theme) => ({
    boxContainer: {
      border: `1px solid ${theme.palette.grey[300]}`,
      borderRadius: theme.shape.borderRadius,
      backgroundColor: theme.palette.common.white,
      height: '300px',
      margin: theme.spacing(1),
      padding: theme.spacing(1),
      overflowY: 'scroll',
      width: '100%'
    }
  }),
  { name: 'PromoteListingsSection' }
)

export default function PromoteListingsSection() {
  const classes = useStyles()

  const addMlsAccountButtonRef = useRef<Nullable<HTMLButtonElement>>(null)

  const { listings, isLoading } = useBrandAndDealsListings()

  const handleAddMlsAccountClick = () => {
    // Go to settings and open add MLS account dialog
    goTo('/dashboard/account/connected-accounts', null, {
      action: 'add-mls-account'
    })
  }

  return (
    <SectionLayout
      title="To Market"
      actionNode={
        !isLoading &&
        listings?.length > 0 && (
          <LinkSectionAction title="View All" url="/dashboard/listings" />
        )
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

      {!isLoading && listings.length === 0 && (
        <Box className={classes.boxContainer}>
          <EmptyState
            description="Please add your MLS IDs here. Rechat will automatically fetch your listings and create marketing materials for them.
            You can then share your listings in a few clicks."
            iconSrc="/static/icons/empty-states/list.svg"
            title="Add Your MLS (Listing Service Provider) IDs "
          >
            <Box pt={3}>
              <Button
                variant="outlined"
                startIcon={<SvgIcon path={mdiPlus} size={muiIconSizes.small} />}
                ref={addMlsAccountButtonRef}
                onClick={handleAddMlsAccountClick}
              >
                Add Your Listing Service Provider (MLS) ID
              </Button>
            </Box>
          </EmptyState>
        </Box>
      )}
    </SectionLayout>
  )
}
