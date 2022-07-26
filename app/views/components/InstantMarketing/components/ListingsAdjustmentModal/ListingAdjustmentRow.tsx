import { makeStyles, Typography } from '@material-ui/core'

import { getListingFormattedPrice } from '@app/utils/listing'
import { TextMiddleTruncate } from '@app/views/components/TextMiddleTruncate'

import { IAdjustment } from './types'

const useStyles = makeStyles(
  theme => ({
    adjustment: {
      display: 'flex',
      alignItems: 'center',
      flexWrap: 'nowrap',
      justifyContent: 'space-between',
      backgroundColor: theme.palette.info.ultralight,
      borderBottom: `1px solid ${theme.palette.divider}`,
      padding: theme.spacing(1, 2)
    },
    adjustmentDescription: {
      fontWeight: theme.typography.fontWeightThin
    },
    adjustmentValue: {
      color: theme.palette.grey[900]
    }
  }),
  { name: 'ListingAdjustmentRow' }
)

interface Props {
  adjustments: IAdjustment[]
}

const ListingAdjustmentRow = ({ adjustments }: Props) => {
  const classes = useStyles()

  return (
    <>
      {adjustments.map((adjustment, index) => (
        <div key={index} className={classes.adjustment}>
          <Typography className={classes.adjustmentDescription} variant="body2">
            <TextMiddleTruncate text={adjustment.description} maxLength={28} />
          </Typography>
          <Typography className={classes.adjustmentValue} variant="subtitle2">
            ${getListingFormattedPrice(adjustment.value, false)}
          </Typography>
        </div>
      ))}
    </>
  )
}

export default ListingAdjustmentRow
