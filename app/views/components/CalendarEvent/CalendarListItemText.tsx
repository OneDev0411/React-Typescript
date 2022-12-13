import { memo } from 'react'

import {
  ListItemText,
  makeStyles,
  Theme,
  useMediaQuery
} from '@material-ui/core'

import { convertTimestampToDate, fromNow } from '@app/utils/date-utils'
import { isDealEvent } from '@app/views/components/GridCalendar/helpers/normalize-events/helpers/event-checker'
import { getTitle } from '@app/views/components/GridCalendar/helpers/normalize-events/helpers/get-title'
import { TextMiddleTruncate } from '@app/views/components/TextMiddleTruncate'
import Link from 'components/ALink'

interface Props {
  event: ICalendarEvent
}

const useStyles = makeStyles(
  (theme: Theme) => ({
    root: {
      paddingRight: theme.spacing(2),
      overflow: 'hidden',
      whiteSpace: 'nowrap',
      textOverflow: 'ellipsis',
      '-webkit-line-clamp': 2,
      display: '-webkit-box',
      '-webkit-box-orient': 'vertical',
      width: '100%'
    }
  }),
  { name: 'CalendarListItemText' }
)

function CalendarListItemText({ event }: Props) {
  const classes = useStyles()
  const isMobileView = useMediaQuery((theme: Theme) =>
    theme.breakpoints.down('xs')
  )

  const contact = event.people?.[0]?.type === 'contact' ? event.people[0] : null

  const baseTitle = getTitle(event)
  const getEventTitle = () => {
    if (isDealEvent(event)) {
      return (
        <Link to={`/dashboard/deals/${event.deal}`}>
          {isMobileView ? <TextMiddleTruncate text={baseTitle} /> : baseTitle}
        </Link>
      )
    }

    if (contact) {
      return (
        <Link to={`/dashboard/contacts/${contact.id}`}>
          {isMobileView ? <TextMiddleTruncate text={baseTitle} /> : baseTitle}
        </Link>
      )
    }

    return baseTitle
  }
  const getEventSubTitle = () => {
    const baseDate = convertTimestampToDate(event.sort_timestamp)
    const currentDate = new Date()

    if (event.all_day) {
      baseDate.setFullYear(
        currentDate.getUTCFullYear(),
        baseDate.getUTCMonth(),
        baseDate.getUTCDate()
      )
      baseDate.setHours(baseDate.getUTCHours(), baseDate.getUTCMinutes(), 0, 0)
    }

    const humanizedEventTime = fromNow(baseDate)

    if (event.type === 'home_anniversary' && contact) {
      return `${baseTitle} ${humanizedEventTime}`
    }

    return humanizedEventTime
  }

  return (
    <ListItemText
      classes={{ root: classes.root }}
      primary={getEventTitle()}
      secondary={getEventSubTitle()}
    />
  )
}

export default memo(CalendarListItemText)
