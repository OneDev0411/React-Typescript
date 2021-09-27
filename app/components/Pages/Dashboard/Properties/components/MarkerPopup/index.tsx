import { Chip, Grid, makeStyles, Typography } from '@material-ui/core'
import BathtubOutlinedIcon from '@material-ui/icons/BathtubOutlined'
import FullscreenOutlinedIcon from '@material-ui/icons/FullscreenOutlined'
import KingBedOutlinedIcon from '@material-ui/icons/KingBedOutlined'
import RoomOutlinedIcon from '@material-ui/icons/RoomOutlined'
import { useSelector } from 'react-redux'

import { noop } from '@app/utils/helpers'
import {
  getListingFormatedPrice,
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
  listing: ICompactListing
  onClick?: () => void
}

const MarkerPopup = ({ listing, onClick = noop }: Props) => {
  const classes = useStyles()
  const user = useSelector(selectUserUnsafe)

  const statusColor = getStatusColorClass(listing.status)
  const price = getListingFormatedPrice(listing, user, false)
  const squareFeet = Math.floor(
    metersToFeet(listing.compact_property.square_meters)
  ).toLocaleString()
  const address = addressTitle(listing.address)
  const bathCount = listing.compact_property.bathroom_count ?? 0
  const bedroomCount = listing.compact_property.bedroom_count ?? 0
  const coverImageURL = listing.cover_image_url
    ? `${getResizeUrl(listing.cover_image_url)}?w=160`
    : PLACEHOLDER_IMAGE
  const status = listing.status

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
