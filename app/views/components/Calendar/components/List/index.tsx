import React, { useState, useRef, forwardRef, RefObject } from 'react'
import { ListOnItemsRenderedProps } from 'react-window'
import useResizeObserver from 'use-resize-observer'

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
}

const defaultProps = {
  onReachStart: () => {},
  onReachEnd: () => {},
  onVisibleRowChange: () => {}
}

const CalendarList: React.FC<Props> = props => {
  const listRef = useRef<VirtualListRef>(null)
  const [activeDate, setActiveDate] = useState<Date | null>(null)
  const [containerRef, listWidth, listHeight] = useResizeObserver()

  const getInViewDate = (data: ListOnItemsRenderedProps) => {
    const index = new Array(data.visibleStopIndex - data.visibleStartIndex)
      .fill(null)
      .findIndex(
        (_, index) => props.rows[index + data.visibleStartIndex].is_header
      )

    const item = props.rows[index + data.visibleStartIndex]
    const date = new Date(item.title)

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
        onVisibleRowChange={getInViewDate}
        itemSize={() => 60}
        ref={listRef}
      >
        {({ index, style }) => (
          <>
            {props.rows[index].is_header ? (
              <DayHeader
                key={props.rows[index].title}
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
