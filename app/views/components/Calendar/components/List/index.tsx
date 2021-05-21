import { useState } from 'react'

import { Box, makeStyles, Theme } from '@material-ui/core'

import { CrmEventType } from 'components/Calendar/types'

import { ListContext } from './context'
// import { EmptyState } from './EmptyState'

import { EventController } from './EventController'

import { Event } from './Event'
import { EventHeader } from './EventHeader'

const useStyles = makeStyles(
  (theme: Theme) => ({
    root: {},
    header: {
      width: theme.spacing(12)
    },
    section: {
      borderBottom: '1px solid #ccc',
      paddingLeft: theme.spacing(2)
    },
    events: {
      '& $event:nth-child(even)': {
        backgroundColor: theme.palette.grey['50']
      }
    },
    event: {
      backgroundColor: '#fff',
      '&:hover': {
        backgroundColor: theme.palette.grey['100']
      }
    }
  }),
  {
    name: 'CalendarList'
  }
)

interface Props {
  user: IUser
  contact: IContact | undefined
  rows: ICalendarListRow[]
  isLoading: boolean
  onReachStart?(): void
  onReachEnd?(): void
  onChangeActiveDate(date: Date): void
  onCrmEventChange: (event: IEvent, type: CrmEventType) => void
  onScheduledEmailChange: (
    event: ICalendarEvent,
    emailCampaign: IEmailCampaign
  ) => void
}

export function CalendarList(props: Props) {
  const classes = useStyles()

  const [selectedEvent, setSelectedEvent] = useState<ICalendarEvent | null>(
    null
  )

  /**
   * triggers when an event updates or deletes
   * @param event - the event
   * @param type - type of action
   */
  const handleEventChange = (event: IEvent, type: CrmEventType) => {
    props.onCrmEventChange(event, type)
    setSelectedEvent(null)
  }

  /**
   * triggers when an email campaign updates
   * @param event - the event
   * @param emailCampaign - the updated email camapign
   */
  const handleScheduledEmailChange = (emailCampaign: IEmailCampaign) => {
    props.onScheduledEmailChange(selectedEvent as ICalendarEvent, emailCampaign)
    setSelectedEvent(null)
  }

  const { contact } = props

  return (
    <ListContext.Provider
      value={{
        selectedEvent,
        contact,
        setSelectedEvent
      }}
    >
      <Box className={classes.root}>
        {props.rows.map((section, index) => (
          <Box className={classes.section} display="flex" key={index}>
            <Box className={classes.header}>
              <EventHeader item={section.header} />
            </Box>

            <Box flexGrow={1} className={classes.events}>
              {section.events.map((event, eventIndex) => (
                <div key={eventIndex} className={classes.event}>
                  <Event event={event} onEventChange={handleEventChange} />
                </div>
              ))}
            </Box>
          </Box>
        ))}
      </Box>

      <EventController
        user={props.user}
        onEventChange={handleEventChange}
        onScheduledEmailChange={handleScheduledEmailChange}
      />
    </ListContext.Provider>
  )
}
