import React, { useState, useRef, forwardRef, RefObject } from 'react'
import { ListOnItemsRenderedProps } from 'react-window'
import useResizeObserver from 'use-resize-observer'

import VirtualList, {
  LoadingPosition,
  VirtualListRef
} from 'components/VirtualList'

import { Container } from './styled'
import { DayTitleItem } from './DayTitleItem'
import { EventItem } from './EventItem'

interface IProps {
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

const CalendarList: React.FC<IProps> = props => {
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

    setActiveDate(date)
    props.onChangeActiveDate(date)
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
        itemSize={() => 50}
        ref={listRef}
      >
        {({ index, style }) => (
          <>
            {props.rows[index].is_header ? (
              <DayTitleItem
                item={props.rows[index]}
                style={style}
                activeDate={activeDate}
              />
            ) : (
              <EventItem item={props.rows[index]} style={style} />
            )}
          </>
        )}
      </VirtualList>
    </Container>
  )
}

CalendarList.defaultProps = defaultProps

export default forwardRef((props: IProps, ref: RefObject<VirtualListRef>) => (
  <CalendarList {...props} listRef={ref} />
))
