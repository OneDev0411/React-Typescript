import React, { ComponentProps, forwardRef, RefObject, useState } from 'react'
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles'

import { ListOnItemsRenderedProps } from 'react-window'
import useResizeObserver from 'use-resize-observer'

import debounce from 'lodash/debounce'

import VirtualList, {
  LoadingPosition,
  VirtualListRef
} from 'components/VirtualList'

import { CrmEventType } from 'components/Calendar/types'

import { ListContext } from './context'
import { EmptyState } from './EmptyState'

import { EventController } from './EventController'

import { Row } from './Row'

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    container: {
      height: '100%'
    }
  })
)

interface Props {
  user: IUser
  contact: IContact | undefined
  rows: ICalendarListRow[]
  isLoading: boolean
  loadingPosition: LoadingPosition
  listRef?: RefObject<VirtualListRef>
  onReachStart?(): void
  onReachEnd?(): void
  onChangeActiveDate(date: Date): void
  onCrmEventChange: (event: IEvent, type: CrmEventType) => void
  onScheduledEmailChange: (
    event: ICalendarEvent,
    emailCampaign: IEmailCampaign
  ) => void
}

const defaultProps = {
  onReachStart: () => {},
  onReachEnd: () => {},
  onVisibleRowChange: () => {}
}

const CalendarList: React.FC<Props> = props => {
  const classes = useStyles()
  const [containerRef, listWidth, listHeight] = useResizeObserver()
  const [activeDate, setActiveDate] = useState<Date | null>(null)
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

  /**
   * finds and the returns the first day header which is in view
   * @param data - list data, see [[ ListOnItemsRenderedProps ]]
   */
  const getInViewDate = (data: ListOnItemsRenderedProps) => {
    const index = new Array(data.visibleStopIndex - data.visibleStartIndex)
      .fill(null)
      .findIndex((_, index) =>
        props.rows[index + data.visibleStartIndex].hasOwnProperty(
          'isEventHeader'
        )
      )

    const item = props.rows[index + data.visibleStartIndex]

    if (!item) {
      return
    }

    const date = new Date(item.date)

    if (activeDate && date.getTime() === activeDate.getTime()) {
      return
    }

    if (date instanceof Date && !Number.isNaN(date.getTime())) {
      setActiveDate(date)
      props.onChangeActiveDate(date)
    }
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
      <div className={classes.container} ref={containerRef}>
        {props.rows.length === 0 && !props.isLoading && <EmptyState />}

        <VirtualList
          width={listWidth}
          height={listHeight}
          itemCount={props.rows.length}
          itemData={
            {
              rows: props.rows,
              activeDate,
              onEventChange: handleEventChange
            } as ComponentProps<typeof Row>['data']
          }
          onReachEnd={props.onReachEnd}
          onReachStart={props.onReachStart}
          threshold={2}
          isLoading={props.isLoading}
          loadingPosition={props.loadingPosition}
          onVisibleRowChange={debounce(getInViewDate, 50)}
          itemSize={() => 64}
          overscanCount={3}
          ref={props.listRef}
        >
          {Row}
        </VirtualList>

        <EventController
          activeDate={activeDate}
          user={props.user}
          onEventChange={handleEventChange}
          onScheduledEmailChange={handleScheduledEmailChange}
        />
      </div>
    </ListContext.Provider>
  )
}

CalendarList.defaultProps = defaultProps

export default forwardRef((props: Props, ref: RefObject<VirtualListRef>) => (
  <CalendarList {...props} listRef={ref} />
))
