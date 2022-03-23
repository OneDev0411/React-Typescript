import React, { useEffect, useRef } from 'react'

import {
  Box,
  Grid,
  Button,
  Container,
  RootRef,
  makeStyles,
  Theme,
  useTheme,
  useMediaQuery
} from '@material-ui/core'
import { useSelector } from 'react-redux'

import { useGetListing, UseGetListing } from '@app/hooks/use-get-listing'
import { logUserActivity } from '@app/models/user/log-activity'
import { noop } from '@app/utils/helpers.js'
import LoadingContainer from 'components/LoadingContainer'
import { selectUserUnsafe } from 'selectors/user'
import listingUtils from 'utils/listing'

import ShareModal from '../../../components/Pages/Dashboard/MLS/components/modals/ShareListingModal.js'

import AgentInfo from './AgentInfo'
import ClaimAccountBanner from './ClaimAccountBanner'
import Description from './Description'
import FeaturedImages from './FeaturedImages'
import FeatureList from './FeatureList'
import Gallery from './Gallery'
import { getAgentInfo } from './get-agent-info'
import { getPrice } from './get-price'
import Header from './Header'
import MainFeatures from './MainFeatures'
import Map from './Map'
import MLSNote from './MLSNote'
import Status from './Status'
import Title from './Title'
import { useOgMetaTags } from './use-og-meta-tags'

const useStyles = makeStyles(
  (theme: Theme) => ({
    header: {
      padding: theme.spacing(6, 3),
      [theme.breakpoints.up('lg')]: {
        padding: theme.spacing(6)
      }
    },
    heroWrapper: {
      marginBottom: theme.spacing(7),
      [theme.breakpoints.up('sm')]: {
        marginBottom: theme.spacing(10)
      },
      [theme.breakpoints.up('lg')]: {
        marginBottom: theme.spacing(25),
        paddingLeft: theme.spacing(6),
        paddingRight: theme.spacing(6)
      }
    },
    heroContainer: {
      [theme.breakpoints.up('lg')]: {
        flexDirection: 'row-reverse'
      }
    },
    galleryWrapper: {
      marginBottom: theme.spacing(5),
      [theme.breakpoints.up('lg')]: {
        marginBottom: 0
      }
    },
    heroLeftSideWrapper: {
      padding: theme.spacing(0, 3),

      [theme.breakpoints.up('lg')]: {
        padding: theme.spacing(10, 3, 0, 0)
      }
    },
    titleWrapper: {
      marginBottom: theme.spacing(3),

      [theme.breakpoints.up('sm')]: {
        marginBottom: theme.spacing(5)
      }
    },
    mainFeaturesAndShowOnMapBtnWrapper: {
      margin: '0 auto',
      maxWidth: '320px',
      [theme.breakpoints.only('md')]: {
        maxWidth: '380px'
      },
      [theme.breakpoints.up('lg')]: {
        maxWidth: 'initial',
        margin: 0
      }
    },
    showOnMapButton: {
      '&:hover, &:focus': {
        color: theme.palette.common.white
      }
    },
    featuredImageWrapper: {
      marginBottom: theme.spacing(7),
      [theme.breakpoints.up('sm')]: {
        marginBottom: theme.spacing(11)
      },
      [theme.breakpoints.up('lg')]: {
        marginBottom: 0
      }
    },
    agentAreaWrapper: {
      padding: theme.spacing(0, 3),
      marginBottom: theme.spacing(7),

      [theme.breakpoints.up('lg')]: {
        padding: theme.spacing(0, 6),
        marginBottom: theme.spacing(11)
      }
    },
    descriptionAreaWrapper: {
      padding: theme.spacing(0, 3),
      marginBottom: theme.spacing(7),

      [theme.breakpoints.up('sm')]: {
        marginBottom: theme.spacing(11)
      },

      [theme.breakpoints.up('lg')]: {
        padding: theme.spacing(0, 6)
      }
    },
    descriptionWrapper: {
      marginBottom: theme.spacing(3),
      [theme.breakpoints.up('sm')]: {
        marginBottom: theme.spacing(6)
      }
    }
  }),
  { name: 'ListingDetails' }
)

interface Props {
  id: UUID
  isWidget?: boolean
  onClose?: () => void
  onToggleFavorite?: () => void
}

function ListingDetails({
  id,
  isWidget = false,
  onClose,
  onToggleFavorite = noop
}: Props) {
  const classes = useStyles()
  const theme = useTheme()
  const user = useSelector(selectUserUnsafe)
  const isDesktop = useMediaQuery(theme.breakpoints.up('lg'))
  const [isShareModalOpen, setIsShareModalOpen] = React.useState(false)
  const { listing, status, error }: UseGetListing = useGetListing(id)
  const mapSection = useRef<HTMLDivElement>(null)

  /* 
     In order for Facebook and Twitter crawlers to find our open graph meta tags, 
     We need to place them on the top 1M of our page
     Hemlet does not currently support placement, see:
     https://developers.facebook.com/docs/sharing/webmasters/crawler/
     https://github.com/jimmay5469/react-helmet  
  */
  useOgMetaTags(listing)

  const scrollToMap = () => {
    mapSection.current?.scrollIntoView({ behavior: 'smooth' })
  }

  /* 
    Log user viewing the listing activity
    https://gitlab.com/rechat/web/-/issues/6111
  */
  useEffect(() => {
    const logUserViewListingActivity = async (
      listing: IListing<'proposed_agent'>
    ) => {
      try {
        await logUserActivity(
          {
            action: 'UserViewedListing',
            object_class: 'UserActivityViewListing',
            object: {
              listing: listing.id,
              address: listingUtils.addressTitle(listing.property.address),
              mls: listing.mls,
              mls_number: listing.mls_number,
              type: 'user_activity_view_listing'
            }
          },
          true
        )
      } catch (e) {
        console.log(e)
      }
    }

    if (listing && user) {
      logUserViewListingActivity(listing)
    }
  }, [listing, user])

  const openShareModal = () => setIsShareModalOpen(true)
  const closeShareModal = () => setIsShareModalOpen(false)

  if (!listing) {
    if (status === 'error') {
      // TODO - Error view - blocked by design
      return <div>{error}</div>
    }

    return <LoadingContainer noPaddings style={{ paddingTop: '15%' }} />
  }

  const agent = getAgentInfo(listing)
  const price = getPrice(listing)
  const subtitle1 = listingUtils.addressTitle(listing.property.address)
  const subtitle2 = [
    listingUtils.getListingAddressLine2(listing),
    `MLS#: ${listing.mls_number}`
  ].join(' | ')
  const images = listing.gallery_image_urls || []

  return (
    <Container maxWidth="xl" disableGutters>
      <div className={classes.header}>
        <Header
          isWidget={isWidget}
          listing={listing}
          handleShare={openShareModal}
          handleClose={onClose}
          onToggleFavorite={onToggleFavorite}
        />
      </div>
      <Box className={classes.heroWrapper}>
        <Grid container className={classes.heroContainer}>
          <Grid item xs={12} lg={7} className={classes.galleryWrapper}>
            <Gallery images={images} />
          </Grid>
          <Grid item xs={12} lg={5}>
            <Box className={classes.heroLeftSideWrapper}>
              <Box className={classes.titleWrapper}>
                <Title
                  title={price}
                  subtitle1={subtitle1}
                  subtitle2={subtitle2}
                />
              </Box>
              <Box mb={5}>
                <Status status={listing.status} />
              </Box>
              <Box className={classes.mainFeaturesAndShowOnMapBtnWrapper}>
                <Grid container>
                  <Grid item xs={12} lg={9}>
                    <Box mb={4}>
                      <MainFeatures listing={listing} />
                    </Box>
                  </Grid>
                  <Grid item xs={12} lg={9}>
                    <Button
                      color="primary"
                      fullWidth
                      size="large"
                      variant="contained"
                      className={classes.showOnMapButton}
                      onClick={scrollToMap}
                    >
                      Show on Map
                    </Button>
                  </Grid>
                </Grid>
              </Box>
            </Box>
          </Grid>
        </Grid>
      </Box>
      <Grid container className={classes.agentAreaWrapper}>
        <Grid
          item
          xs={12}
          lg={agent ? 8 : 12}
          className={classes.featuredImageWrapper}
        >
          <FeaturedImages images={images} serie={1} />
        </Grid>
        {agent && (
          <Grid item xs={12} lg={4}>
            <Container maxWidth="xs" disableGutters>
              <AgentInfo
                name={agent.name}
                email={agent.email}
                image={agent.image}
                tel={agent.tel}
                company={agent.brokrageName}
              />
            </Container>
          </Grid>
        )}
      </Grid>
      {isDesktop && (
        <Box px={6} mb={20}>
          <FeatureList listing={listing} />
        </Box>
      )}
      <Grid container className={classes.descriptionAreaWrapper}>
        <Grid item xs={12} lg={4}>
          <Box className={classes.descriptionWrapper}>
            <Description
              address={subtitle1}
              description={listing.property.description}
              officeName={listing.list_office_name}
            />
          </Box>
        </Grid>
        <Grid item xs={12} lg={8}>
          <FeaturedImages images={images} serie={2} />
        </Grid>
      </Grid>
      {!isDesktop && (
        <Box mb={9} px={3}>
          <FeatureList listing={listing} />
        </Box>
      )}
      <Box px={3} mb={5}>
        <RootRef rootRef={mapSection}>
          <Map location={listing.property.address.location} />
        </RootRef>
      </Box>
      <Box p={3}>
        <MLSNote
          mls={listing.mls}
          mlsName={listing.mls_name}
          logo={listing.mls_info?.logo}
          disclaimer={listing.mls_info?.disclaimer}
        />
      </Box>

      <ShareModal
        listing={listing}
        user={user}
        isActive={isShareModalOpen}
        onHide={closeShareModal}
      />

      <ClaimAccountBanner />
    </Container>
  )
}

export default ListingDetails

// TODO: Adding ClaimAccountBanner - Blocked by server server#1656
