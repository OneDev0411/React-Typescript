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
      padding: theme.spacing(1),
      background: theme.palette.tertiary.main,
      [theme.breakpoints.up('md')]: {
        background: 'transparent',
        padding: theme.spacing(4)
      }
    },
    heroWrapper: {
      marginBottom: theme.spacing(4),
      [theme.breakpoints.up('sm')]: {
        marginBottom: theme.spacing(5)
      },
      [theme.breakpoints.up('md')]: {
        marginBottom: theme.spacing(6),
        padding: theme.spacing(0, 4)
      }
    },
    heroContainer: {
      [theme.breakpoints.up('md')]: {
        flexDirection: 'row-reverse',
        alignItems: 'center'
      }
    },
    galleryWrapper: {
      marginBottom: theme.spacing(2),
      [theme.breakpoints.up('md')]: {
        marginBottom: 0
      }
    },
    heroLeftSideWrapper: {
      padding: theme.spacing(0, 3),
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'stretch',
      justifyContent: 'space-between',
      height: '100%',
      [theme.breakpoints.up('md')]: {
        padding: theme.spacing(0, 3, 0, 0)
      }
    },
    titleWrapper: {
      marginBottom: theme.spacing(2),
      [theme.breakpoints.up('sm')]: {
        marginBottom: theme.spacing(5)
      }
    },
    statusWrapper: {
      marginBottom: theme.spacing(2),
      [theme.breakpoints.up('sm')]: {
        marginBottom: theme.spacing(4)
      }
    },
    showOnMapButton: {
      textTransform: 'uppercase',
      '&:hover, &:focus': {
        color: theme.palette.common.white
      }
    },
    featuredImageWrapper: {
      marginBottom: theme.spacing(4),
      [theme.breakpoints.up('sm')]: {
        marginBottom: theme.spacing(6)
      },
      [theme.breakpoints.up('md')]: {
        marginBottom: 0
      }
    },
    agentAreaWrapper: {
      overflow: 'hidden', // because of MUI nested grid limitation https://v4.mui.com/components/grid/#limitations
      marginBottom: theme.spacing(4),

      [theme.breakpoints.up('md')]: {
        padding: theme.spacing(0, 4),
        marginBottom: theme.spacing(6)
      }
    },
    agentWrapper: {
      width: '100%',
      padding: theme.spacing(0, 3),
      [theme.breakpoints.up('md')]: {
        padding: theme.spacing(0),
        marginLeft: theme.spacing(6)
      }
    },
    descriptionAreaWrapper: {
      overflow: 'hidden', // because of MUI nested grid limitation https://v4.mui.com/components/grid/#limitations
      marginBottom: theme.spacing(4),
      [theme.breakpoints.up('md')]: {
        padding: theme.spacing(0, 4),
        marginBottom: theme.spacing(6)
      }
    },
    descriptionWrapper: {
      marginBottom: theme.spacing(3),
      padding: theme.spacing(0, 3),
      [theme.breakpoints.up('md')]: {
        padding: theme.spacing(0),
        marginBottom: theme.spacing(6)
      }
    }
  }),
  { name: 'ListingDetails' }
)

interface Props {
  id: UUID
  isModal?: boolean
  isWidget?: boolean
  onClose?: () => void
  onToggleFavorite?: () => void
}

// Hiding agent info temporarily due to agent conflict
// https://gitlab.com/rechat/server/-/issues/2172
// TODO: remove this issue and re-enable agent info with better approach
const SHOULD_SHOW_AGENT_INFO = false

function ListingDetails({
  id,
  isModal = false,
  isWidget = false,
  onClose = noop,
  onToggleFavorite = noop
}: Props) {
  const classes = useStyles()
  const theme = useTheme()
  const user = useSelector(selectUserUnsafe)
  const isDesktop = useMediaQuery(theme.breakpoints.up('md'))
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
      listing: IListing<'proposed_agent' | 'mls_info'>
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

  const agent = SHOULD_SHOW_AGENT_INFO ? getAgentInfo(listing) : null
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
          isModal={isModal}
          isWidget={isWidget}
          listing={listing}
          handleClose={onClose}
          handleShare={openShareModal}
          onToggleFavorite={onToggleFavorite}
        />
      </div>
      <Box className={classes.heroWrapper}>
        <Grid container className={classes.heroContainer}>
          <Grid item xs={12} md={5} lg={6} className={classes.galleryWrapper}>
            <Gallery images={images} />
          </Grid>
          <Grid item xs={12} md={7} lg={6}>
            <Box className={classes.heroLeftSideWrapper}>
              <Box className={classes.titleWrapper}>
                <Title
                  title={price}
                  subtitle1={subtitle1}
                  subtitle2={subtitle2}
                />
              </Box>
              <Box className={classes.statusWrapper}>
                <Status status={listing.status} />
              </Box>
              <Box>
                <Grid container>
                  <Grid item xs={12} md={10}>
                    <Box mb={4}>
                      <MainFeatures listing={listing} />
                    </Box>
                  </Grid>
                  <Grid item xs={12} md={10}>
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
      <div className={classes.agentAreaWrapper}>
        <Grid
          container
          spacing={2}
          justifyContent={agent ? undefined : 'center'}
        >
          <Grid
            item
            xs={12}
            md={agent ? 7 : 10}
            className={classes.featuredImageWrapper}
          >
            <FeaturedImages
              isAgent={!!agent}
              direction="row-reverse"
              images={images}
              serie={1}
            />
          </Grid>
          {agent && (
            <Grid item xs={12} md={5}>
              <div className={classes.agentWrapper}>
                <AgentInfo
                  name={agent.name}
                  email={agent.email}
                  image={agent.image}
                  tel={agent.tel}
                  company={agent.brokrageName}
                />
              </div>
            </Grid>
          )}
        </Grid>
      </div>
      {isDesktop && (
        <Box px={4} mb={6}>
          <FeatureList listing={listing} />
        </Box>
      )}
      <div className={classes.descriptionAreaWrapper}>
        <Grid container spacing={2}>
          <Grid item xs={12} md={5}>
            <Box className={classes.descriptionWrapper}>
              <Description
                address={subtitle1}
                description={listing.property.description}
                officeName={listing.list_office_name}
                agentFullName={listing.list_agent?.full_name}
                agentPhoneNumber={listing.list_agent?.phone_number}
                agentEmail={listing.list_agent?.email}
              />
            </Box>
          </Grid>
          <Grid item xs={12} md={7}>
            <FeaturedImages isAgent={!!agent} images={images} serie={2} />
          </Grid>
        </Grid>
      </div>
      {!isDesktop && (
        <Box px={4} mb={6}>
          <FeatureList listing={listing} />
        </Box>
      )}
      <Box px={4} mb={4}>
        <RootRef rootRef={mapSection}>
          <Map location={listing.property.address.location} />
        </RootRef>
      </Box>
      <Box p={4}>
        <MLSNote
          mlsName={listing.mls_info.mls}
          logo={listing.mls_info.logo}
          disclaimer={listing.mls_info.disclaimer}
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
