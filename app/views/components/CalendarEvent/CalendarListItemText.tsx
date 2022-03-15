import { useMemo } from 'react'

import { ListItemText, makeStyles, Theme } from '@material-ui/core'

import { isDealEvent } from '@app/views/components/GridCalendar/helpers/normalize-events/helpers/event-checker'
import { getTitle } from '@app/views/components/GridCalendar/helpers/normalize-events/helpers/get-title'
import Link from 'components/ALink'
import { fromNow } from 'utils/date-utils'

interface Props {
  event: ICalendarEvent
}

const useStyles = makeStyles(
  (theme: Theme) => ({
    primary: {
      '& a': {
        paddingRight: theme.spacing(2),
        overflow: 'hidden',
        textOverflow: 'ellipsis',
        'line-clamp': 2 /* number of lines to show */,
        display: '-webkit-box',
        '-webkit-line-clamp': 2,
        '-webkit-box-orient': 'vertical'
      }
    }
  }),
  { name: 'CalendarListItemText' }
)

export default function CalendarListItemText({ event }: Props) {
  let eventSubTitle
  let eventTitleLink
  const eventTitle = getTitle(event)

  const classes = useStyles()

  const contact =
    event.people &&
    event.people.length > 0 &&
    event.people[0].type === 'contact'
      ? event.people[0]
      : null

  const humanizedEventTime = useMemo(() => {
    const eventTime = new Date(event.next_occurence)

    return fromNow(eventTime)
  }, [event.next_occurence])

  // Build titles
  if (isDealEvent(event)) {
    eventTitleLink = (
      <Link to={`/dashboard/deals/${event.deal}`}>{eventTitle}</Link>
    )
  }

  if (contact) {
    eventTitleLink = (
      <Link to={`/dashboard/contacts/${contact.id}`}>{eventTitle}</Link>
    )
  }

  // Build subTitles
  eventSubTitle = humanizedEventTime

  if (event.type === 'home_anniversary' && contact) {
    eventSubTitle = `${eventTitle} ${humanizedEventTime}`
  }

  return (
    <ListItemText
      className={classes.primary}
      primary={eventTitleLink || eventTitle}
      secondary={eventSubTitle}
    />
  )
}
