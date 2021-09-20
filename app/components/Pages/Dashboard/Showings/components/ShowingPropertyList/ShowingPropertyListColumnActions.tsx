import { MouseEvent } from 'react'

import { makeStyles } from '@material-ui/core'
import { mdiCalendar, mdiOpenInNew } from '@mdi/js'

import { muiIconSizes } from '@app/views/components/SvgIcons/icon-sizes'
import { SvgIcon } from '@app/views/components/SvgIcons/SvgIcon'

import LinkButton from '../LinkButton'

const useStyles = makeStyles(
  theme => ({
    bookingButton: { color: `${theme.palette.primary.main} !important` },
    listingButton: { marginLeft: theme.spacing(1) }
  }),
  { name: 'ShowingPropertyListColumnActions' }
)

interface ShowingPropertyListColumnActionsProps {
  className: string
  bookingUrl: string
  listingId?: UUID
}

function ShowingPropertyListColumnActions({
  className,
  bookingUrl,
  listingId
}: ShowingPropertyListColumnActionsProps) {
  const classes = useStyles()
  const handleClick = (event: MouseEvent) => {
    event.stopPropagation()
  }

  return (
    <div className={className} onClick={handleClick}>
      <LinkButton
        className={classes.bookingButton}
        size="small"
        variant="outlined"
        to={bookingUrl}
        target="_blank"
        startIcon={<SvgIcon path={mdiCalendar} size={muiIconSizes.small} />}
        color="primary"
      >
        Booking Page
      </LinkButton>
      {listingId && (
        <LinkButton
          className={classes.listingButton}
          size="small"
          variant="outlined"
          to={`/dashboard/mls/${listingId}`}
          target="_blank"
          endIcon={<SvgIcon path={mdiOpenInNew} size={muiIconSizes.small} />}
          color="default"
        >
          Listing Page
        </LinkButton>
      )}
    </div>
  )
}

export default ShowingPropertyListColumnActions
