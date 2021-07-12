import { Grid, Typography, Chip, makeStyles } from '@material-ui/core'

import { getListingAddress, getStatusColor } from '@app/utils/listing'

const useStyles = makeStyles(
  theme => ({
    statusChip: {
      paddingLeft: theme.spacing(0.5)
    },
    statusBadgeIcon: {
      width: theme.spacing(2),
      height: theme.spacing(2),
      borderRadius: '50%'
    }
  }),
  {
    name: 'ListingHeader'
  }
)

interface Props {
  title: string
  listing: IListing | ICompactListing
}

export default function ListingHeader({ title, listing }: Props) {
  const classes = useStyles()
  const address = getListingAddress(listing)
  const badgeColor = `#${getStatusColor(listing.status)}`

  return (
    <Grid container direction="column" spacing={1}>
      <Grid item>
        <Typography variant="h4">{title}</Typography>
      </Grid>
      <Grid container item direction="row" spacing={1}>
        <Grid item>
          <Typography variant="h6" color="textSecondary">
            {address}
          </Typography>
        </Grid>
        <Grid item>
          <Chip
            variant="outlined"
            label={listing.status}
            className={classes.statusChip}
            icon={
              <div
                className={classes.statusBadgeIcon}
                style={{
                  backgroundColor: badgeColor
                }}
              />
            }
          />
        </Grid>
      </Grid>
    </Grid>
  )
}
