import React, { useState, forwardRef, RefObject } from 'react'
import { ListOnItemsRenderedProps } from 'react-window'
import useResizeObserver from 'use-resize-observer'
import debounce from 'lodash/debounce'

import VirtualList, {
  LoadingPosition,
  VirtualListRef
} from 'components/VirtualList'

import { Container } from './styled'
import { DayHeader } from './DayHeader'
import { Event } from './Event'

interface Props {
  rows: any[]
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
  const [activeDate, setActiveDate] = useState<Date | null>(null)
  const [containerRef, listWidth, listHeight] = useResizeObserver()

  const getInViewDate = (data: ListOnItemsRenderedProps) => {
    const index = new Array(data.visibleStopIndex - data.visibleStartIndex)
      .fill(null)
      .findIndex(
        (_, index) => props.rows[index + data.visibleStartIndex].is_day_header
      )

    const item = props.rows[index + data.visibleStartIndex]

    if (!item) {
      return
    }

    const date = new Date(item.date)

    if (date instanceof Date && !Number.isNaN(date.getTime())) {
      setActiveDate(date)
      props.onChangeActiveDate(date)
    }
  }

  return (
    <Container ref={containerRef}>
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
        ref={props.listRef}
      >
        {({ index, style }) => (
          <>
            {props.rows[index].is_day_header ? (
              <DayHeader
                key={props.rows[index].date}
                item={props.rows[index]}
                style={style}
                activeDate={activeDate}
              />
            ) : (
              <Event
                key={props.rows[index].index}
                item={props.rows[index]}
                nextItem={props.rows[index + 1]}
                style={style}
                onCrmEventChange={props.onCrmEventChange}
              />
            )}
          </>
        )}
      </VirtualList>
    </Container>
  )
}

CalendarList.defaultProps = defaultProps

export default forwardRef((props: Props, ref: RefObject<VirtualListRef>) => (
  <CalendarList {...props} listRef={ref} />
))
