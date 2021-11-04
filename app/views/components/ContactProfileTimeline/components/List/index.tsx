import { useState } from 'react'

import {
  Box,
  Button,
  makeStyles,
  Theme,
  CircularProgress
} from '@material-ui/core'

import { CrmEventType } from 'components/ContactProfileTimeline/types'

import { ListContext } from './context'
import { EmptyState } from './EmptyState'
import { Event } from './Event'
import { EventController } from './EventController'
import { EventHeader } from './EventHeader'

const useStyles = makeStyles(
  (theme: Theme) => ({
    eventHeaderContainer: {
      width: theme.spacing(12)
    },
    eventsSectionContainer: {
      display: 'flex',
      borderBottom: `1px solid ${theme.palette.action.disabledBackground}`,
      paddingLeft: theme.spacing(2)
    },
    eventsListContainer: {
      '& $event:nth-child(even)': {
        backgroundColor: theme.palette.grey['50']
      }
    },
    eventContainer: {
      flexGrow: 1,
      backgroundColor: '#fff',
      '&:hover': {
        backgroundColor: theme.palette.grey['100']
      }
    },
    mainContainer: {
      position: 'relative',
      width: '100%',
      height: '100%'
    },
    calendarContainer: {
      position: 'absolute',
      overflowY: 'auto',
      zIndex: 1,
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      padding: theme.spacing(2, 1)
    },
    progressLoaderContainer: {
      position: 'absolute',
      zIndex: 10,
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(255, 255, 255, 0.6)'
    },
    progressLoaderIcon: {
      position: 'absolute',
      top: '20%',
      left: '50%'
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

  const Loader = () => (
    <Box className={classes.progressLoaderContainer}>
      <CircularProgress className={classes.progressLoaderIcon} />
    </Box>
  )

  const CalendarLoader = () => (
    <Box className={classes.calendarContainer}>
      <Box my={1} textAlign="center">
        <Button
          size="small"
          disabled={isLoading}
          onClick={onLoadPreviousEvents}
        >
          Load Next Year Events
        </Button>
      </Box>
      <Box>
        {rows.map((section, index) => (
          <Box
            className={classes.eventsSectionContainer}
            key={`${section.header.date}-${index}`}
          >
            <Box className={classes.eventHeaderContainer}>
              <EventHeader item={section.header} />
            </Box>

            <Box className={classes.eventsListContainer}>
              {section.events.map(event => (
                <div key={event.id} className={classes.eventContainer}>
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
    </Box>
  )

  return (
    <ListContext.Provider
      value={{
        selectedEvent,
        contact,
        setSelectedEvent
      }}
    >
      {rows.length === 0 ? (
        <EmptyState rowsCount={rows.length} />
      ) : (
        <Box className={classes.mainContainer}>
          {isLoading ? <Loader /> : <></>}
          <CalendarLoader />
        </Box>
      )}

      <EventController
        user={user}
        onEventChange={handleEventChange}
        onScheduledEmailChange={handleScheduledEmailChange}
      />
    </ListContext.Provider>
  )
}
