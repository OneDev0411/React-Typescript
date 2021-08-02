import { MouseEvent } from 'react'

import { makeStyles } from '@material-ui/core'
import { mdiCalendar } from '@mdi/js'

import { muiIconSizes } from '@app/views/components/SvgIcons/icon-sizes'
import { SvgIcon } from '@app/views/components/SvgIcons/SvgIcon'

import LinkButton from '../LinkButton'

const useStyles = makeStyles(
  theme => ({ action: { color: `${theme.palette.primary.main} !important` } }),
  { name: 'ShowingPropertyListColumnActions' }
)

interface ShowingPropertyListColumnActionsProps {
  className: string
  bookingUrl: string
}

function ShowingPropertyListColumnActions({
  className,
  bookingUrl
}: ShowingPropertyListColumnActionsProps) {
  const classes = useStyles()
  const handleClick = (event: MouseEvent) => {
    event.stopPropagation()
  }

  return (
    <div className={className} onClick={handleClick}>
      <LinkButton
        className={classes.action}
        size="small"
        variant="outlined"
        to={bookingUrl}
        target="_blank"
        startIcon={<SvgIcon path={mdiCalendar} size={muiIconSizes.small} />}
        color="primary"
      >
        Booking Page
      </LinkButton>
    </div>
  )
}

export default ShowingPropertyListColumnActions
