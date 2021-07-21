import { makeStyles, Typography } from '@material-ui/core'
import classNames from 'classnames'
import fecha from 'fecha'

import { getStatusColorClass } from 'utils/listing'

const useStyles = makeStyles(
  theme => ({
    root: {
      color: theme.palette.common.white,
      padding: theme.spacing(0.5, 1),
      borderRadius: theme.spacing(0.5)
    }
  }),
  { name: 'ListingStatus' }
)

interface ListingStatusProps {
  className?: string
  listing: Pick<ICompactListing, 'status' | 'close_date' | 'status'>
}

function ListingStatus({
  className,
  listing: { status, close_date }
}: ListingStatusProps) {
  const classes = useStyles()

  const label =
    (status === 'Sold' || status === 'Leased') && close_date
      ? `${status} ${fecha.format(new Date(close_date * 1000), 'mediumDate')}`
      : status

  return (
    <Typography
      className={classNames(classes.root, className)}
      style={{
        backgroundColor: getStatusColorClass(status)
      }}
      variant="caption"
      component="span"
    >
      {label}
    </Typography>
  )
}

export default ListingStatus
