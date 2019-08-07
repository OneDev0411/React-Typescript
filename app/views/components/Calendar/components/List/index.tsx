import React, { useState, forwardRef, RefObject } from 'react'
import { ListOnItemsRenderedProps } from 'react-window'
import useResizeObserver from 'use-resize-observer'
import debounce from 'lodash/debounce'

import VirtualList, {
  LoadingPosition,
  VirtualListRef
} from 'components/VirtualList'

import { CrmEvents } from '../CrmEvents'

import { DayHeader } from './DayHeader'
import { Event } from './Event'
import { EmptyState } from './EmptyState'

import { Container } from './styled'

interface Props {
  user: IUser
  rows: ICalendarListRow[]
  isLoading: boolean
  loadingPosition: LoadingPosition
  listRef?: RefObject<VirtualListRef>
  onReachStart?(): void
  onReachEnd?(): void
  onChangeActiveDate(date: Date): void
  onCrmEventChange: (event: IEvent, type: string) => void
}

const defaultProps = {
  onReachStart: () => {},
  onReachEnd: () => {},
  onVisibleRowChange: () => {}
}

const CalendarList: React.FC<Props> = props => {
  const [containerRef, listWidth, listHeight] = useResizeObserver()
  const [activeDate, setActiveDate] = useState<Date | null>(null)
  const [
    selectedCrmEvent,
    setSelectedCrmEvent
  ] = useState<ICalendarEvent | null>(null)

  const handleEventChange = (event: IEvent, type: string) => {
    setSelectedCrmEvent(null)

    props.onCrmEventChange(event, type)
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
          'is_day_header'
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

  return (
    <Container ref={containerRef} className="abcded">
      {props.rows.length === 0 && !props.isLoading && <EmptyState />}

      <VirtualList
        width={listWidth}
        height={listHeight}
        itemCount={props.rows.length}
        onReachEnd={props.onReachEnd}
        onReachStart={props.onReachStart}
        threshold={2}
        isLoading={props.isLoading}
        loadingPosition={props.loadingPosition}
        onVisibleRowChange={debounce(getInViewDate, 50)}
        itemSize={() => 60}
        overscanCount={3}
        ref={props.listRef}
      >
        {({ index, style }) => (
          <>
            {props.rows[index].hasOwnProperty('is_day_header') ? (
              <DayHeader
                key={props.rows[index].date}
                item={props.rows[index] as ICalendarDayRow}
                style={style}
                activeDate={activeDate}
              />
            ) : (
              <Event
                key={index}
                event={props.rows[index] as ICalendarEvent}
                nextItem={props.rows[index + 1]}
                style={style}
                onClickCrmEventAssociations={setSelectedCrmEvent}
              />
            )}
          </>
        )}
      </VirtualList>

      {selectedCrmEvent && (
        <CrmEvents
          isEventDrawerOpen
          event={selectedCrmEvent}
          user={props.user}
          onEventChange={handleEventChange}
          onCloseEventDrawer={() => setSelectedCrmEvent(null)}
        />
      )}
    </Container>
  )
}

CalendarList.defaultProps = defaultProps

export default forwardRef((props: Props, ref: RefObject<VirtualListRef>) => (
  <CalendarList {...props} listRef={ref} />
))
