import React, { useState } from 'react'
import { ListOnItemsRenderedProps } from 'react-window'
import useResizeObserver from 'use-resize-observer'

import VirtualList, { LoadingPosition } from 'components/VirtualList'

import { createRows } from './helpers/create-rows'
import { Container } from './styled'

interface IProps {
  events: CalendarEventsList
  isLoading: boolean
  loadingPosition: LoadingPosition
  onReachStart?(): void
  onReachEnd?(): void
  onChangeActiveDate(date: Date): void
}

const defaultProps = {
  onReachStart: () => {},
  onReachEnd: () => {},
  onVisibleRowChange: () => {}
}

const CalendarTable: React.FC<IProps> = props => {
  const [activeDate, setActiveDate] = useState<Date | null>(null)
  const [containerRef, listWidth, listHeight] = useResizeObserver()

  const rows = createRows(props.events)

  const getInViewDate = (data: ListOnItemsRenderedProps) => {
    const index = new Array(data.visibleStopIndex - data.visibleStartIndex)
      .fill(null)
      .findIndex((_, index) => rows[index + data.visibleStartIndex].is_header)

    const item = rows[index + data.visibleStartIndex]
    const date = new Date(item.title)

    setActiveDate(date)
    props.onChangeActiveDate(date)
  }

  const getHeaderBackground = (date: string) =>
    activeDate && activeDate.toDateString() === new Date(date).toDateString()
      ? '#ccc'
      : '#f5f5f5'

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
        // itemSize={(index: number): number => {
        //   if (index === 177) {
        //     console.log(rows[index])
        //   }

        //   return !rows[index].is_header ? 64 : 32
        // }}
        // style={{
        //   border: '1px solid green'
        // }}
      >
        {({ index, style }) => (
          <>
            {rows[index].is_header ? (
              <div
                className="date-title"
                style={{
                  ...style,
                  display: 'flex',
                  alignItems: 'center'
                }}
              >
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    padding: '0 1rem',
                    border: '1px solid #ccc',
                    borderRadius: '4px',
                    transition: '0.2 ease-in backgroundColor',
                    backgroundColor: getHeaderBackground(rows[index].title),
                    width: '100%',
                    height: '32px'
                  }}
                >
                  {new Date(rows[index].title).toDateString()}
                </div>
              </div>
            ) : (
              <div
                key={rows[index].id}
                style={{
                  ...style,
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  padding: '0 1rem',
                  borderBottom: '1px solid RebeccaPurple'
                }}
              >
                <div>{rows[index].title}</div>
                <div>actions</div>
              </div>
            )}
          </>
        )}
      </VirtualList>
    </Container>
  )
}

CalendarTable.defaultProps = defaultProps

export default CalendarTable
