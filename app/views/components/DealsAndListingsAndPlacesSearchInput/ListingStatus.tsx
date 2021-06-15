import { makeStyles } from '@material-ui/core'
import fecha from 'fecha'

import { getStatusColorClass } from 'utils/listing'

// TODO: Fix the style later
const useStyles = makeStyles(
  theme => ({
    root: {
      color: theme.palette.common.white,
      padding: '0.25rem 0.5rem',
      fontSize: '0.75rem',
      borderRadius: 3,
      fontWeight: 500,
      marginLeft: theme.spacing(1)
    }
  }),
  { name: 'ListingStatus' }
)

interface ListingStatusProps {
  listing: Pick<ICompactListing, 'status' | 'close_date' | 'status'>
}

function ListingStatus({
  listing: { status, close_date }
}: ListingStatusProps) {
  const classes = useStyles()

  const getStatus = () => {
    if ((status === 'Sold' || status === 'Leased') && close_date) {
      return `${status} ${fecha.format(
        new Date(close_date * 1000),
        'mediumDate'
      )}`
    }

    return status
  }

  return (
    <span
      className={classes.root}
      style={{
        backgroundColor: getStatusColorClass(status)
      }}
    >
      {getStatus()}
    </span>
  )
}

export default ListingStatus
