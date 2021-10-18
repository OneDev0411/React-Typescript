import { memo } from 'react'

import { Chip, Grid, makeStyles, Typography } from '@material-ui/core'
import {
  mdiShower,
  mdiBedKingOutline,
  mdiFullscreen,
  mdiMapMarkerOutline
} from '@mdi/js'
import { useSelector } from 'react-redux'

import { selectUserUnsafe } from '@app/selectors/user'
import { noop } from '@app/utils/helpers'
import {
  getListingFormatedPrice,
  addressTitle,
  metersToFeet,
  getResizeUrl,
  getStatusColorClass
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
    status: { color: '#fff', fontSize: 12, marginTop: theme.spacing(-1) },
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
  closePrice: Nullable<number>
  squareMeters: number
  status: IListingStatus
  address: ICompactAddress
  bathroomCount: Nullable<number>
  bedroomCount: Nullable<number>
  coverImageUrl: string
  propertyType: string
  onClick?: () => void
}

const MarkerPopup = ({
  status,
  price,
  closePrice,
  address,
  squareMeters,
  bathroomCount,
  bedroomCount,
  coverImageUrl,
  propertyType,
  onClick = noop
}: Props) => {
  const classes = useStyles()
  const user = useSelector(selectUserUnsafe)

  const statusColor = getStatusColorClass(status)
  const listingPrice = getListingFormatedPrice(price, closePrice, user, false)
  const squareFeet = Math.floor(metersToFeet(squareMeters)).toLocaleString()
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
      />
      <div className={classes.info}>
        <Grid container justifyContent="space-between" alignItems="center">
          <Typography variant="subtitle1" className={classes.price}>
            ${listingPrice}
          </Typography>
          <Chip
            size="small"
            className={classes.status}
            style={{ backgroundColor: statusColor }}
            label={status}
          />
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
              <SvgIcon path={mdiFullscreen} className={classes.icon} />
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
