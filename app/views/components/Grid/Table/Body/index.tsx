import React, {
  useState,
  useRef,
  ComponentProps,
  useEffect,
  useMemo
} from 'react'
import { Theme } from '@material-ui/core'

import AutoSizer from 'react-virtualized-auto-sizer'
import { useWindowSize, useWindowScroll } from 'react-use'
import useDebouncedCallback from 'use-debounce/lib/callback'
import debounce from 'lodash/debounce'

import {
  FixedSizeList,
  ListOnItemsRenderedProps,
  ScrollDirection,
  ListOnScrollProps
} from 'react-window'

import { useTheme } from '@material-ui/styles'

import { getColumnsSize } from '../helpers/get-columns-size'
import { useGridContext } from '../hooks/use-grid-context'

import {
  TableColumn,
  GridClasses,
  TrProps,
  TdProps,
  InfiniteScrollingOptions
} from '../types'

import Row from './Row'

interface Props<Row> {
  columns: TableColumn<Row>[]
  rows: (Row & { id?: string })[]
  classes: GridClasses
  virtualize: boolean
  infiniteScrolling: InfiniteScrollingOptions | null
  getTrProps?: (data: TrProps<Row>) => object
  getTdProps?: (data: TdProps<Row>) => object
}

export function Body<Row>({
  columns,
  rows,
  classes,
  virtualize,
  infiniteScrolling,
  getTdProps = () => ({}),
  getTrProps = () => ({})
}: Props<Row>) {
  const theme = useTheme<Theme>()
  const [state] = useGridContext()
  const [scroll, setScroll] = useState<ListOnScrollProps | null>(null)

  const { height: windowHeight } = useWindowSize()
  const { y: scrollTop } = useWindowScroll()

  const listRef = useRef<FixedSizeList>(null)

  const columnsSize = useMemo(() => getColumnsSize<Row>(columns), [columns])

  const [deboundedOnReachStart] = useDebouncedCallback(
    infiniteScrolling ? infiniteScrolling.onReachStart : () => null,
    300
  )
  const [debouncedOnReachEnd] = useDebouncedCallback(
    infiniteScrolling ? infiniteScrolling.onReachEnd : () => null,
    300
  )

  useEffect(() => {
    listRef.current && listRef.current.scrollTo(scrollTop)
  }, [scrollTop])

  const onItemsRendered = (data: ListOnItemsRenderedProps): void => {
    if (!scroll) {
      return
    }

    if (isReachedStart(data, scroll.scrollDirection)) {
      console.log('[ Grid ] Reached Start')
      deboundedOnReachStart()
    }

    if (isReachedEnd(data, scroll.scrollDirection, rows.length)) {
      console.log('[ Grid ] Reached End')
      debouncedOnReachEnd()
    }
  }

  if (!virtualize) {
    return (
      <>
        {rows.map((row, rowIndex) => (
          <Row
            key={row.id || rowIndex}
            index={rowIndex}
            style={{
              height: theme.spacing(8)
            }}
            data={{
              rows,
              columns,
              state,
              classes,
              getTrProps,
              getTdProps,
              columnsSize
            }}
          />
        ))}
      </>
    )
  }

  return (
    <>
      <AutoSizer disableHeight>
        {({ width }) => (
          <FixedSizeList
            ref={listRef}
            itemCount={rows.length}
            itemSize={theme.spacing(8)}
            width={width}
            height={windowHeight}
            overscanCount={8}
            itemKey={(
              index: number,
              { rows }: ComponentProps<typeof Row>['data']
            ) => rows[index].id || index}
            itemData={
              {
                rows,
                columns,
                state,
                classes,
                getTrProps,
                getTdProps,
                columnsSize
              } as ComponentProps<typeof Row>['data']
            }
            style={{
              // I've searched 1.5 days to find this
              height: '100% !important'
            }}
            {...(infiniteScrolling
              ? {
                  onItemsRendered: debounce(onItemsRendered, 100),
                  onScroll: setScroll
                }
              : {})}
          >
            {Row}
          </FixedSizeList>
        )}
      </AutoSizer>
    </>
  )
}

/**
 * checks whether scroll is reached start of list or not
 * @param data
 * @param scrollDirection
 */
function isReachedStart(
  data: ListOnItemsRenderedProps | null,
  scrollDirection: ScrollDirection | null,
  threshold: number = 2
): boolean {
  if (!data) {
    return false
  }

  return data.visibleStartIndex < threshold && scrollDirection === 'backward'
}

/**
 * checks whether scroll is reached end of list or not
 * @param data
 * @param scrollDirection
 * @param rowsCount
 */
function isReachedEnd(
  data: ListOnItemsRenderedProps | null,
  scrollDirection: ScrollDirection | null,
  itemCount: number,
  threshold: number = 2
): boolean {
  // when data is not provided or when the list is short (isn't scrolling)
  if (!data || data.visibleStartIndex === data.overscanStartIndex) {
    return false
  }

  return (
    itemCount - data.visibleStopIndex < threshold &&
    scrollDirection === 'forward'
  )
}
