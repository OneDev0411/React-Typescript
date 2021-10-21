import { useState } from 'react'

import { Box, Button, makeStyles, Theme } from '@material-ui/core'

import { CrmEventType } from 'components/ContactProfileTimeline/types'

import { ListContext } from './context'
import { EmptyState } from './EmptyState'
import { Event } from './Event'
import { EventController } from './EventController'
import { EventHeader } from './EventHeader'

const useStyles = makeStyles(
  (theme: Theme) => ({
    header: {
      width: theme.spacing(12)
    },
    section: {
      display: 'flex',
      borderBottom: `1px solid ${theme.palette.action.disabledBackground}`,
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
  isReachedStart: boolean
  isReachedEnd: boolean
  onLoadNextEvents: () => void
  onLoadPreviousEvents: () => void
  onCrmEventChange: (event: IEvent, type: CrmEventType) => void
  onScheduledEmailChange: (
    event: ICalendarEvent,
    emailCampaign: IEmailCampaign
  ) => void
}

export function CalendarList({
  user,
  contact,
  rows,
  isLoading,
  isReachedEnd,
  isReachedStart,
  onLoadNextEvents,
  onLoadPreviousEvents,
  onCrmEventChange,
  onScheduledEmailChange
}: Props) {
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
    onCrmEventChange(event, type)
    setSelectedEvent(null)
  }

  /**
   * triggers when an email campaign updates
   * @param event - the event
   * @param emailCampaign - the updated email camapign
   */
  const handleScheduledEmailChange = (emailCampaign: IEmailCampaign) => {
    onScheduledEmailChange(selectedEvent as ICalendarEvent, emailCampaign)
    setSelectedEvent(null)
  }

  return (
    <ListContext.Provider
      value={{
        selectedEvent,
        contact,
        setSelectedEvent
      }}
    >
      <Box my={1} textAlign="center">
        <Button
          size="small"
          disabled={isLoading}
          onClick={onLoadPreviousEvents}
        >
          Load Next Year Events
        </Button>
      </Box>

      <EmptyState rowsCount={rows.length} isLoading={isLoading} />

      <Box>
        {rows.map((section, index) => (
          <Box
            className={classes.section}
            key={`${section.header.date}-${index}`}
          >
            <Box className={classes.header}>
              <EventHeader item={section.header} />
            </Box>

            <Box flexGrow={1} className={classes.events}>
              {section.events.map(event => (
                <div key={event.id} className={classes.event}>
                  <Event event={event} onEventChange={handleEventChange} />
                </div>
              ))}
            </Box>
          </Box>
        ))}
      </Box>

      <Box my={1} textAlign="center">
        <Button size="small" disabled={isLoading} onClick={onLoadNextEvents}>
          Load Previous Year Events
        </Button>
      </Box>

      <EventController
        user={user}
        onEventChange={handleEventChange}
        onScheduledEmailChange={handleScheduledEmailChange}
      />
    </ListContext.Provider>
  )
}
