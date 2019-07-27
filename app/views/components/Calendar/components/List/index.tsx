import React, { useState, useEffect } from 'react'
import { ListOnItemsRenderedProps } from 'react-window'
import useResizeObserver from 'use-resize-observer'

import VirtualList, { LoadingPosition } from 'components/VirtualList'

import { createRows } from './helpers/create-rows'
import { Container } from './styled'
import { DayTitleItem } from './DayTitleItem'
import { EventItem } from './EventItem'

interface IProps {
  events: CalendarEventsList
  isLoading: boolean
  loadingPosition: LoadingPosition
  range: NumberRange
  onReachStart?(): void
  onReachEnd?(): void
  onChangeActiveDate(date: Date): void
}

const defaultProps = {
  onReachStart: () => {},
  onReachEnd: () => {},
  onVisibleRowChange: () => {}
}

const CalendarList: React.FC<IProps> = props => {
  const [activeDate, setActiveDate] = useState<Date | null>(null)
  const [rows, setRows] = useState([])
  const [containerRef, listWidth, listHeight] = useResizeObserver()

  useEffect(() => {
    setRows(createRows(props.events))
  }, [props.events, props.range])

  const getInViewDate = (data: ListOnItemsRenderedProps) => {
    const index = new Array(data.visibleStopIndex - data.visibleStartIndex)
      .fill(null)
      .findIndex((_, index) => rows[index + data.visibleStartIndex].is_header)

    const item = rows[index + data.visibleStartIndex]
    const date = new Date(item.title)

    setActiveDate(date)
    props.onChangeActiveDate(date)
  }

  return (
    <Container ref={containerRef}>
      <VirtualList
        width={listWidth}
        height={listHeight}
        itemCount={rows.length}
        onReachEnd={props.onReachEnd}
        onReachStart={props.onReachStart}
        threshold={2}
        isLoading={props.isLoading}
        loadingPosition={props.loadingPosition}
        onVisibleRowChange={getInViewDate}
        itemSize={() => 50}
      >
        {({ index, style }) => (
          <>
            {rows[index].is_header ? (
              <DayTitleItem
                item={rows[index]}
                style={style}
                activeDate={activeDate}
              />
            ) : (
              <EventItem item={rows[index]} style={style} />
            )}
          </>
        )}
      </VirtualList>
    </Container>
  )
}

CalendarList.defaultProps = defaultProps

export default CalendarList
