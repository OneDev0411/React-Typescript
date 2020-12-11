import React from 'react'
import { useSelector } from 'react-redux'
import Box from '@material-ui/core/Box'
import Grid from '@material-ui/core/Grid'
import Container from '@material-ui/core/Container'
import { makeStyles, Theme, useTheme, useMediaQuery } from '@material-ui/core'

import { IAppState } from 'reducers'
import listingUtils from 'utils/listing'
import LoadingContainer from 'components/LoadingContainer'
import { useLogUserActivity } from 'hooks/use-log-user-activity'

import ShareModal from '../../../components/Pages/Dashboard/Listings/components/modals/ShareListingModal.js'
import { useGetListing, UseGetListing } from './use-get-listing'
import Header from './Header'
import Title from './Title'
import Status from './Status'
import Gallery from './Gallery'
import MainFeatures from './MainFeatures'
import StaticMap from './StaticMap'
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
    mainFeaturesWrapper: {
      marginBottom: theme.spacing(4),
      [theme.breakpoints.up('sm')]: {
        paddingRight: theme.spacing(3)
      },
      [theme.breakpoints.up('lg')]: {
        padding: 0
      }
    },
    staticMapWrapper: {
      [theme.breakpoints.up('sm')]: {
        paddingLeft: theme.spacing(3)
      },
      [theme.breakpoints.up('lg')]: {
        padding: 0
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
  const user = useSelector<IAppState, IUser>((state: IAppState) => state.user)
  const isDesktop = useMediaQuery(theme.breakpoints.up('lg'))
  const [isShareModalOpen, setIsShareModalOpen] = React.useState(false)
  const { listing, status, error }: UseGetListing = useGetListing(id)

  useLogUserActivity(listing?.id)

  const openShareModal = () => setIsShareModalOpen(true)
  const closeShareModal = () => setIsShareModalOpen(false)

  if (!listing) {
    if (status === 'error') {
      return <div>{error}</div>
    }

    return <LoadingContainer />
  }

  const agent = getAgentInfo(listing)
  const title = getPrice(listing)
  const subtitle1 = listingUtils.addressTitle(listing.property.address)
  const subtitle2 = `${getSubAddress(listing)} | MLS#: ${listing.mls_number}`
  const images = listing.gallery_image_urls || []
  const getFeaturedImages = (serie: number) => {
    const start = serie === 1 ? 5 : 8

    return images.slice(start, start + 3)
  }

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
              <Grid container>
                <Grid item xs={12} sm={6} lg={8}>
                  <Box className={classes.mainFeaturesWrapper}>
                    <MainFeatures listing={listing} />
                  </Box>
                </Grid>
                <Grid item xs={12} sm={6} lg={8}>
                  <Box className={classes.staticMapWrapper}>
                    <StaticMap location={listing.property.address.location} />
                  </Box>
                </Grid>
              </Grid>
            </Box>
          </Grid>
        </Grid>
      </Box>
      <Grid container className={classes.agentAreaWrapper}>
        <Grid
          item
          xs={12}
          lg={agent ? 7 : 12}
          className={classes.featuredImageWrapper}
        >
          <FeaturedImages images={getFeaturedImages(1)} />
        </Grid>
        {agent && (
          <Grid item xs={12} lg={5}>
            <AgentInfo
              name={agent.name}
              email={agent.email}
              image={agent.image}
              tel={agent.tel}
            />
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
            />
          </Box>
        </Grid>
        <Grid item xs={12} lg={8}>
          <FeaturedImages images={getFeaturedImages(2)} />
        </Grid>
      </Grid>
      {!isDesktop && (
        <Box mb={9} px={3}>
          <FeatureList listing={listing} />
        </Box>
      )}
      <Box px={3} mb={5}>
        <Map location={listing.property.address.location} />
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
