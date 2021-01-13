import React, { useRef } from 'react'
import { useSelector } from 'react-redux'
import { Box, Grid, Button, Container, RootRef } from '@material-ui/core'
import { makeStyles, Theme, useTheme, useMediaQuery } from '@material-ui/core'

import listingUtils from 'utils/listing'
import LoadingContainer from 'components/LoadingContainer'
import { useLogUserActivity } from 'hooks/use-log-user-activity'
import { selectUserUnsafe } from 'selectors/user'

import ShareModal from '../../../components/Pages/Dashboard/Listings/components/modals/ShareListingModal.js'
import { useGetListing, UseGetListing } from './use-get-listing'
import Header from './Header'
import Title from './Title'
import Status from './Status'
import Gallery from './Gallery'
import MainFeatures from './MainFeatures'
import FeaturedImages from './FeaturedImages'
import AgentInfo from './AgentInfo'
import Description from './Description'
import FeatureList from './FeatureList'
import Map from './Map'
import MLSNote from './MLSNote'
import ClaimAccountBanner from './ClaimAccountBanner'
import { getPrice } from './get-price'
import { getSubAddress } from './get-sub-address'
import { getAgentInfo } from './get-agent-info'

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
  onClose?: () => void
}

function ListingDetails({ id, onClose }: Props) {
  const classes = useStyles()
  const theme = useTheme()
  const user = useSelector(selectUserUnsafe)
  const isDesktop = useMediaQuery(theme.breakpoints.up('lg'))
  const [isShareModalOpen, setIsShareModalOpen] = React.useState(false)
  const { listing, status, error }: UseGetListing = useGetListing(id)
  const mapSection = useRef<HTMLDivElement>(null)

  const scrollToMap = () => {
    mapSection.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useLogUserActivity(listing?.id)

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
  const title = getPrice(listing)
  const subtitle1 = listingUtils.addressTitle(listing.property.address)
  const subtitle2 = `${getSubAddress(listing)} | MLS#: ${listing.mls_number}`
  const images = listing.gallery_image_urls || []

  return (
    <Container maxWidth="xl" disableGutters>
      <div className={classes.header}>
        <Header
          listing={listing}
          handleShare={openShareModal}
          handleClose={onClose}
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
                  title={title}
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
        <MLSNote mls={listing.mls} mlsName={listing.mls_name} />
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
