import {
  Grid,
  Box,
  Card,
  CardContent,
  Typography,
  Tooltip,
  Hidden,
  makeStyles,
  Theme
} from '@material-ui/core'

import AgentCard from 'components/AgentCard'

import { getFormattedPrice } from 'models/Deal/helpers/context'
import { isLeaseProperty } from 'utils/listing'

const useStyles = makeStyles(
  (theme: Theme) => ({
    container: {
      position: 'relative',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'space-between',
      [theme.breakpoints.up('sm')]: {
        padding: theme.spacing(5)
      }
    },
    listingImage: {
      objectFit: 'cover',
      width: '100%',
      maxHeight: '100%',
      [theme.breakpoints.up('sm')]: {
        minHeight: '100vh',
        position: 'absolute',
        top: 0,
        left: 0,
        zIndex: -1
      }
    },
    listingAddress: {
      textAlign: 'center'
    },
    listingPrice: {
      [theme.breakpoints.down('xs')]: {
        textAlign: 'center'
      },
      [theme.breakpoints.up('sm')]: {
        ...theme.typography.h6
      }
    }
  }),
  {
    name: 'ShowingInfoSection'
  }
)

interface Props {
  showing: IPublicShowing
}

export default function InfoSection({ showing }: Props) {
  const classes = useStyles()

  const listingImage = showing.listing?.gallery_image_urls?.[0] ?? null

  return (
    <Grid item xs={12} sm={6} md={5} className={classes.container}>
      <Hidden smUp>
        <Grid container item justify="center">
          <Grid item xs={4}>
            <Box pb={2} pt={3}>
              <img alt="logo" src="/static/images/logo.svg" />
            </Box>
          </Grid>
        </Grid>
      </Hidden>
      {listingImage && (
        <img
          src={listingImage}
          alt="listing"
          title="listing"
          className={classes.listingImage}
        />
      )}
      {showing.listing && (
        <Grid container item>
          <Grid item xs={12}>
            <Tooltip title={showing.listing.property.address.full_address}>
              <Card variant="outlined">
                <CardContent>
                  <Typography
                    variant="subtitle2"
                    color="primary"
                    className={classes.listingPrice}
                  >
                    {getFormattedPrice(showing.listing.price, 'currency', 0)}
                    {isLeaseProperty(showing.listing) ? '/mo' : ''}
                  </Typography>
                  <Box pt={1}>
                    <Hidden smUp>
                      <Typography
                        noWrap
                        variant="body1"
                        className={classes.listingAddress}
                      >
                        {showing.listing.property.address.full_address}
                      </Typography>
                    </Hidden>
                    <Hidden xsDown>
                      <Typography noWrap variant="h5">
                        {showing.listing.property.address.street_address}
                      </Typography>
                    </Hidden>
                  </Box>
                </CardContent>
              </Card>
            </Tooltip>
          </Grid>
        </Grid>
      )}

      <Hidden xsDown>
        <Grid container item>
          <AgentCard agent={showing.agent} />
        </Grid>
      </Hidden>
    </Grid>
  )
}
