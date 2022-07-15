import { Grid, makeStyles, Typography } from '@material-ui/core'
import {
  mdiShower,
  mdiBedKingOutline,
  mdiVectorSquare,
  mdiMapMarkerOutline
} from '@mdi/js'

import { addressTitle, metersToFeet } from '@app/utils/listing'
import { muiIconSizes } from '@app/views/components/SvgIcons/icon-sizes'
import { SvgIcon } from 'components/SvgIcons/SvgIcon'

import { IListingWithAdjustment } from './types'

const useStyles = makeStyles(
  theme => ({
    headerInfo: {
      padding: theme.spacing(2, 2, 1, 2),
      textAlign: 'left'
    },
    address: {
      display: 'flex',
      alignItems: 'center'
    },
    addressIcon: {
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
  { name: 'ListingAdjustmentCard' }
)

interface Props {
  listing: IListingWithAdjustment
}

const ListingAdjustmentCardSummery = ({ listing }: Props) => {
  const { property } = listing

  const {
    square_meters: squareMeters,
    bathroom_count: bathroomCount,
    bedroom_count: bedroomCount,
    property_type: propertyType,
    address
  } = property

  const classes = useStyles()

  const squareFeet = Math.round(metersToFeet(squareMeters)).toLocaleString()
  const fullAddress = addressTitle(address)
  const baths = bathroomCount ?? 0
  const bedrooms = bedroomCount ?? 0

  return (
    <div>
      <Typography variant="button" className={classes.address}>
        <SvgIcon
          path={mdiMapMarkerOutline}
          size={muiIconSizes.small}
          className={classes.addressIcon}
        />
        {fullAddress}
      </Typography>
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
    </div>
  )
}

export default ListingAdjustmentCardSummery
