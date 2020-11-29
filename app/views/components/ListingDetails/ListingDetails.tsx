import React from 'react'
import { useSelector } from 'react-redux'
import Box from '@material-ui/core/Box'
import Grid from '@material-ui/core/Grid'
import { makeStyles, Theme, useTheme, useMediaQuery } from '@material-ui/core'

import { IAppState } from 'reducers'
import { getActiveBrand } from 'utils/user-teams'
import listingUtils from 'utils/listing'

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
import { getPrice } from './get-price'
import { getSubAddress } from './get-sub-address'

const useStyles = makeStyles(
  (theme: Theme) => ({
    container: {
      maxWidth: '1440px',
      margin: '0 auto'
    },
    indexWrapper: {
      marginBottom: theme.spacing(7),
      [theme.breakpoints.up('md')]: {
        paddingLeft: theme.spacing(3),
        paddingRight: theme.spacing(3)
      }
    },
    indexContainer: {
      [theme.breakpoints.up('md')]: {
        flexDirection: 'row-reverse'
      }
    },
    galleryWrapper: {
      marginBottom: theme.spacing(5),
      [theme.breakpoints.up('md')]: {
        marginBottom: 0
      }
    },
    indexLeftSideWrapper: {
      paddingLeft: theme.spacing(3),
      paddingRight: theme.spacing(3),

      [theme.breakpoints.up('md')]: {
        paddingLeft: 0
      }
    },
    titleWrapper: {
      marginBottom: theme.spacing(5)
    },
    mainFeaturesWrapper: {
      marginBottom: theme.spacing(3)
    },
    featuredImageWrapper: {
      marginBottom: theme.spacing(7)
    },
    agentAreaWrapper: {
      paddingLeft: theme.spacing(3),
      paddingRight: theme.spacing(3),
      marginBottom: theme.spacing(7),

      [theme.breakpoints.up('md')]: {
        paddingLeft: 0,
        paddingRight: 0
      }
    },
    descriptionAreaWrapper: {
      paddingLeft: theme.spacing(3),
      paddingRight: theme.spacing(3),
      marginBottom: theme.spacing(7),

      [theme.breakpoints.up('md')]: {
        paddingLeft: 0,
        paddingRight: 0,
        flexDirection: 'row-reverse'
      }
    }
  }),
  { name: 'ListingDetails' }
)

interface Props {
  id: UUID
}

function ListingDetails({ id }: Props) {
  const classes = useStyles()
  const theme = useTheme()
  const user = useSelector<IAppState, IUser>((state: IAppState) => state.user)
  const brand = getActiveBrand(user)
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'))
  const isDesktop = useMediaQuery(theme.breakpoints.up('md'))

  const { listing }: UseGetListing = useGetListing(id)

  if (!listing) {
    return 'Loading...'
  }

  const agent = listing.list_agent
  const title = getPrice(listing)
  const subtitle1 = listingUtils.addressTitle(listing.property.address)
  const subtitle2 = `${getSubAddress(listing)} | MLS#: ${listing.mls_number}`

  return (
    <Box className={classes.container}>
      <Header id={listing.id} />
      <Box className={classes.indexWrapper}>
        <Grid container className={classes.indexContainer}>
          <Grid item xs={12} lg={6} className={classes.galleryWrapper}>
            <Gallery images={listing.gallery_image_urls} />
          </Grid>
          <Grid item xs={12} lg={6}>
            <Box className={classes.indexLeftSideWrapper}>
              <Box className={classes.titleWrapper}>
                <Box mb={3}>
                  <Title
                    title={title}
                    subtitle1={subtitle1}
                    subtitle2={subtitle2}
                  />
                </Box>
                <Status status={listing.status} />
              </Box>
              <Box
                className={classes.mainFeaturesWrapper}
                pr={isDesktop && '20%'}
              >
                <MainFeatures listing={listing} />
              </Box>
              <StaticMap location={listing.property.address.location} />
            </Box>
          </Grid>
        </Grid>
      </Box>
      <Grid container className={classes.agentAreaWrapper}>
        <Grid item xs={12} lg={6} className={classes.featuredImageWrapper}>
          <FeaturedImages images={listing.gallery_image_urls?.slice(5, 8)} />
        </Grid>
        <Grid item xs={12} lg={6}>
          <AgentInfo
            name={agent.full_name}
            email={agent.email}
            image={agent.profile_image_url}
            tel={agent.phone_number}
            company={brand?.name}
          />
        </Grid>
      </Grid>
      {!isMobile && <FeatureList listing={listing} />}
      <Grid container className={classes.descriptionAreaWrapper}>
        <Grid item xs={12} lg={6}>
          <Box mb={3}>
            <Description
              address={listing.property.address.full_address}
              description={listing.property.description}
            />
          </Box>
        </Grid>
        <Grid item xs={12} lg={6}>
          <FeaturedImages images={listing.gallery_image_urls?.slice(8, 11)} />
        </Grid>
      </Grid>
      {isMobile && (
        <Box mb={4}>
          <FeatureList listing={listing} />
        </Box>
      )}
      <Box px={3} pb={3}>
        <Map location={listing.property.address.location} />
      </Box>
    </Box>
  )
}

export default ListingDetails
