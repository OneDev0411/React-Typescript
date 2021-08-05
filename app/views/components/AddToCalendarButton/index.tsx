import { ReactNode } from 'react'

import { google, outlook, CalendarEvent } from 'calendar-link'

import LinkButton from '@app/views/components/LinkButton'
import GoogleIcon from '@app/views/components/SvgIcons/Google/IconGoogle'
import { iconSizes } from '@app/views/components/SvgIcons/icon-sizes'
import OutlookIcon from '@app/views/components/SvgIcons/Outlook/IconOutlook'

interface Props extends CalendarEvent {
  calendar: 'Google' | 'Outlook'
  children: ReactNode
}

export default function AddToCalendarButton({
  calendar,
  children,
  ...eventProps
}: Props) {
  const eventLink =
    calendar === 'Google' ? google(eventProps) : outlook(eventProps)

  const icon =
    calendar === 'Google' ? (
      <GoogleIcon size={iconSizes.small} />
    ) : (
      <OutlookIcon size={iconSizes.small} />
    )

  return (
    <LinkButton variant="outlined" to={eventLink} target="_blank">
      <>
        {icon}&nbsp;&nbsp;{children}
      </>
    </LinkButton>
  )
}
