import { ReactNode } from 'react'

import { makeStyles } from '@material-ui/core'
import { google, outlook, CalendarEvent } from 'calendar-link'

import LinkButton from '@app/views/components/LinkButton'
import GoogleIcon from '@app/views/components/SvgIcons/Google/IconGoogle'
import { iconSizes } from '@app/views/components/SvgIcons/icon-sizes'
import OutlookIcon from '@app/views/components/SvgIcons/Outlook/IconOutlook'

const useStyles = makeStyles(
  theme => ({
    icon: {
      marginRight: theme.spacing(1)
    }
  }),
  { name: 'AddToCalendarButton' }
)

interface Props extends CalendarEvent {
  calendar: 'Google' | 'Outlook'
  children: ReactNode
}

export default function AddToCalendarButton({
  calendar,
  children,
  ...eventProps
}: Props) {
  const classes = useStyles()
  const eventLink =
    calendar === 'Google' ? google(eventProps) : outlook(eventProps)

  const icon =
    calendar === 'Google' ? (
      <GoogleIcon size={iconSizes.small} className={classes.icon} />
    ) : (
      <OutlookIcon size={iconSizes.small} className={classes.icon} />
    )

  return (
    <LinkButton variant="outlined" to={eventLink} target="_blank">
      <>
        {icon}
        {children}
      </>
    </LinkButton>
  )
}
