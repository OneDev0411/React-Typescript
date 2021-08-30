import { Chip, Grid, makeStyles, Typography } from '@material-ui/core'
import BathtubOutlinedIcon from '@material-ui/icons/BathtubOutlined'
import FullscreenOutlinedIcon from '@material-ui/icons/FullscreenOutlined'
import KingBedOutlinedIcon from '@material-ui/icons/KingBedOutlined'
import RoomOutlinedIcon from '@material-ui/icons/RoomOutlined'
import { useSelector } from 'react-redux'

import {
  getListingPrice,
  addressTitle,
  metersToFeet,
  getResizeUrl,
  getStatusColorClass
} from '@app/utils/listing'
import { selectUserUnsafe } from 'selectors/user'

const PLACEHOLDER_IMAGE = '/static/images/logo--gray.svg'

const useStyles = makeStyles(
  theme => ({
    container: {
      position: 'absolute',
      bottom: 30,
      left: -120,
      width: 300,
      backgroundColor: 'white',
      boxShadow: '0 2px 7px 1px rgba(0, 0, 0, 0.3)',
      fontSize: 14,
      zIndex: theme.zIndex.modal,
      borderRadius: 5,
      overflow: 'hidden'
    },
    image: {
      backgroundRepeat: 'none',
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      backgroundColor: '#ccc',
      height: 150
    },
    info: {
      padding: '10px 15px',
      color: '#000',
      textAlign: 'left'
    },
    price: {
      fontSize: theme.typography.h6.fontSize,
      marginBottom: theme.spacing(1)
    },
    status: { color: '#fff', fontSize: 12, marginTop: theme.spacing(-1) },
    address: {
      color: theme.palette.grey[500],
      display: 'flex',
      alignItems: 'center',
      marginTop: theme.spacing(1)
    },
    addressIcon: {
      marginRight: theme.spacing(1),
      marginLeft: theme.spacing(-0.5)
    },
    details: {
      margin: theme.spacing(2, 0)
    },
    detailItem: {
      display: 'flex',
      alignItems: 'center',
      '&:not(:last-child)': {
        paddingRight: theme.spacing(1),
        borderRight: '1px solid #ccc',
        marginRight: theme.spacing(1)
      }
    },
    icon: {
      marginRight: theme.spacing(1)
    }
  }),
  { name: 'MarkerPopup' }
)

interface Props {
  listing: ICompactListing
}

const MarkerPopup = ({ listing }: Props) => {
  const classes = useStyles()
  const user = useSelector(selectUserUnsafe)

  const statusColor = getStatusColorClass(listing.status)
  const price = getListingPrice(listing, user, false)
  const squareFeet = Math.floor(
    metersToFeet(listing.compact_property.square_meters)
  ).toLocaleString()
  const address = addressTitle(listing.address)
  const bathCount = listing.compact_property.bedroom_count ?? 0
  const bedroomCount = listing.compact_property.bathroom_count ?? 0
  const coverImageURL = listing.cover_image_url
    ? `${getResizeUrl(listing.cover_image_url)}?w=160`
    : PLACEHOLDER_IMAGE
  const status = listing.status

  return (
    <div className={classes.container}>
      <div
        className={classes.image}
        style={{ backgroundImage: `url(${coverImageURL})` }}
      />
      <div className={classes.info}>
        <Grid container justifyContent="space-between" alignItems="center">
          <Typography variant="subtitle1" className={classes.price}>
            ${price}
          </Typography>
          <Chip
            size="small"
            className={classes.status}
            style={{ backgroundColor: statusColor }}
            label={status}
          />
        </Grid>

        <Grid className={classes.details} container>
          <Grid className={classes.detailItem} item>
            <KingBedOutlinedIcon className={classes.icon} /> {bedroomCount}
          </Grid>
          <Grid className={classes.detailItem} item>
            <BathtubOutlinedIcon className={classes.icon} /> {bathCount}
          </Grid>
          <Grid className={classes.detailItem} item>
            <FullscreenOutlinedIcon className={classes.icon} /> {squareFeet} ft
            <sup>2</sup>
          </Grid>
        </Grid>

        <Typography variant="body2" className={classes.address}>
          <RoomOutlinedIcon className={classes.addressIcon} /> {address}
        </Typography>
      </div>
    </div>
  )
}

export default MarkerPopup
