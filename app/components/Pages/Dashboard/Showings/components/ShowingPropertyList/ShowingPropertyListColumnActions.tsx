import { MouseEvent } from 'react'

import { mdiCalendar } from '@mdi/js'

import { SvgIcon } from '@app/views/components/SvgIcons/SvgIcon'
import { muiIconSizes } from '@app/views/components/SvgIcons/icon-sizes'

import LinkButton from '../LinkButton'

interface ShowingPropertyListColumnActionsProps {
  className: string
  bookingUrl: string
}

function ShowingPropertyListColumnActions({
  className,
  bookingUrl
}: ShowingPropertyListColumnActionsProps) {
  const handleClick = (event: MouseEvent) => {
    event.stopPropagation()
  }

  return (
    <div className={className} onClick={handleClick}>
      <LinkButton
        size="small"
        variant="outlined"
        to={bookingUrl}
        target="_blank"
        startIcon={<SvgIcon path={mdiCalendar} size={muiIconSizes.small} />}
        color="default"
      >
        Booking Page
      </LinkButton>
    </div>
  )
}

export default ShowingPropertyListColumnActions
