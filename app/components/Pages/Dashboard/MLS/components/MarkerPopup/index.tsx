import { memo } from 'react'

import { alpha, Chip, Grid, makeStyles, Typography } from '@material-ui/core'
import {
  mdiShower,
  mdiBedKingOutline,
  mdiVectorSquare,
  mdiDatabaseOutline,
  mdiMapMarkerOutline
} from '@mdi/js'

import { noop } from '@app/utils/helpers'
import {
  getListingFormattedPrice,
  addressTitle,
  metersToFeet,
  getResizeUrl,
  getStatusColor
} from '@app/utils/listing'
import { SvgIcon } from 'components/SvgIcons/SvgIcon'

const PLACEHOLDER_IMAGE = '/static/images/logo--gray.svg'

const useStyles = makeStyles(
  theme => ({
    container: {
      cursor: 'pointer',
      width: 230,
      backgroundColor: 'white',
      boxShadow: '0 2px 7px 1px rgba(0, 0, 0, 0.3)',
      borderRadius: 5
    },
    image: {
      position: 'relative',
      backgroundRepeat: 'none',
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      backgroundColor: '#ccc',
      height: 110
    },
    info: {
      padding: '10px 15px',
      color: '#000',
      textAlign: 'left'
    },
    price: {
      fontSize: 15,
      marginBottom: theme.spacing(1)
    },
    mlsSource: {
      ...theme.typography.body3,
      display: 'flex',
      alignItems: 'center',
      color: theme.palette.grey[700]
    },
    mlsSourceIcon: {
      maxWidth: theme.spacing(2),
      maxHeight: theme.spacing(2),
      marginRight: theme.spacing(0.5)
    },
    statusContainer: {
      position: 'absolute',
      top: theme.spacing(1),
      right: theme.spacing(1)
    },
    statusChip: {
      fontSize: 12,
      backgroundColor: `${alpha(theme.palette.grey[100], 0.8)}`,
      borderRadius: theme.spacing(0.5),
      filter: `drop-shadow(0px 0.3px 0.5px ${alpha(
        theme.palette.common.black,
        0.1
      )}) drop-shadow(0px 2px 4px ${alpha(theme.palette.common.black, 0.2)})`,
      border: 'none'
    },
    statusDot: (props: Props) => ({
      backgroundColor: `#${getStatusColor(props.status)}`,
      width: theme.spacing(1),
      height: theme.spacing(1),
      borderRadius: '50%',
      display: 'inline-block'
    }),
    iconSmall: {
      // TODO: there should be better ways to handling this.
      // https://stackoverflow.com/questions/63880835
      marginLeft: `${theme.spacing(1)}px !important`
    },
    address: {
      fontSize: 13,
      color: theme.palette.grey[500],
      display: 'flex',
      alignItems: 'center',
      marginTop: theme.spacing(1)
    },
    addressIcon: {
      maxWidth: 16,
      maxHeight: 16,
      marginRight: theme.spacing(0.5),
      marginLeft: theme.spacing(-0.5)
    },
    details: {
      margin: theme.spacing(1, 0)
    },
    detailItem: {
      fontSize: 12,
      display: 'flex',
      alignItems: 'center',
      '&:not(:last-child)': {
        paddingRight: theme.spacing(1),
        borderRight: '1px solid #ccc',
        marginRight: theme.spacing(1)
      }
    },
    icon: {
      maxWidth: 14,
      maxHeight: 14,
      marginRight: theme.spacing(0.5)
    }
  }),
  { name: 'MarkerPopup' }
)

interface Props {
  price: number
  squareMeters: number
  status: IListingStatus
  address: ICompactAddress
  bathroomCount: Nullable<number>
  bedroomCount: Nullable<number>
  coverImageUrl: string
  propertyType: string
  mlsSource?: string
  onClick?: () => void
}

const MarkerPopup = (props: Props) => {
  const {
    status,
    price,
    address,
    squareMeters,
    bathroomCount,
    bedroomCount,
    coverImageUrl,
    propertyType,
    mlsSource = '',
    onClick = noop
  } = props
  const classes = useStyles(props)

  const listingPrice = getListingFormattedPrice(price, false)
  const squareFeet = Math.round(metersToFeet(squareMeters)).toLocaleString()
  const fullAddress = addressTitle(address)
  const baths = bathroomCount ?? 0
  const bedrooms = bedroomCount ?? 0
  const coverImageURL = coverImageUrl
    ? `${getResizeUrl(coverImageUrl)}?w=160`
    : PLACEHOLDER_IMAGE

  return (
    <div
      className={classes.container}
      onClick={() => {
        onClick()
      }}
    >
      <div
        className={classes.image}
        style={{ backgroundImage: `url(${coverImageURL})` }}
      >
        <Grid className={classes.statusContainer}>
          <Chip
            label={status}
            size="small"
            variant="default"
            classes={{
              root: classes.statusChip,
              iconSmall: classes.iconSmall
            }}
            icon={<Grid className={classes.statusDot} />}
          />
        </Grid>
      </div>
      <div className={classes.info}>
        <Grid container justifyContent="space-between" alignItems="flex-start">
          <Typography variant="subtitle1" className={classes.price}>
            ${listingPrice}
          </Typography>
          <Grid
            className={classes.mlsSource}
            item
            title="Listing Provider (MLS) Source"
          >
            <SvgIcon
              path={mdiDatabaseOutline}
              className={classes.mlsSourceIcon}
            />
            {mlsSource}
          </Grid>
        </Grid>

        {!['Commercial', 'Lots & Acreage'].includes(propertyType) && (
          <Grid className={classes.details} container>
            <Grid className={classes.detailItem} item>
              <SvgIcon path={mdiBedKingOutline} className={classes.icon} />
              {bedrooms}
            </Grid>
            <Grid className={classes.detailItem} item>
              <SvgIcon path={mdiShower} className={classes.icon} />
              {baths}
            </Grid>
            <Grid className={classes.detailItem} item>
              <SvgIcon path={mdiVectorSquare} className={classes.icon} />
              {squareFeet} ft
              <sup>2</sup>
            </Grid>
          </Grid>
        )}

        <Typography variant="body2" className={classes.address}>
          <SvgIcon path={mdiMapMarkerOutline} className={classes.addressIcon} />
          {fullAddress}
        </Typography>
      </div>
    </div>
  )
}

export default memo(MarkerPopup)
