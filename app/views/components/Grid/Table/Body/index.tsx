import React, { useRef, ComponentProps } from 'react'
import { Theme } from '@material-ui/core'

import AutoSizer from 'react-virtualized-auto-sizer'
import { WindowScroller } from 'react-virtualized'
import { useWindowSize } from 'react-use'

import { FixedSizeList } from 'react-window'

import { useTheme } from '@material-ui/styles'

import { TableColumn, GridClasses, TrProps, TdProps } from '../types'

import { useGridContext } from '../hooks/use-grid-context'

import Row from './Row'

interface Props<Row> {
  columns: TableColumn<Row>[]
  rows: Row[]
  classes: GridClasses
  getTrProps?: (data: TrProps<Row>) => object
  getTdProps?: (data: TdProps<Row>) => object
}

export function Body<Row>({
  columns,
  rows,
  classes,
  getTdProps = () => ({}),
  getTrProps = () => ({})
}: Props<Row>) {
  const theme = useTheme<Theme>()
  const { height: windowHeight } = useWindowSize()
  const [state] = useGridContext()

  const listRef = useRef<FixedSizeList>(null)

  const handleScroll = ({ scrollTop }) => {
    listRef.current && listRef.current.scrollTo(scrollTop)
  }

  return (
    <div style={{ height: '100%' }}>
      <WindowScroller onScroll={handleScroll}>{() => <div />}</WindowScroller>

      <AutoSizer disableHeight>
        {({ width }) => (
          <FixedSizeList
            className="grid-virtual-list"
            ref={listRef}
            itemCount={rows.length}
            itemSize={theme.spacing(8)}
            width={width}
            height={windowHeight}
            overscanCount={5}
            itemData={
              {
                rows,
                columns,
                state,
                classes,
                getTrProps,
                getTdProps
              } as ComponentProps<typeof Row>['data']
            }
            style={{
              // I've searched 1.5 days to find this
              height: '100% !important'
            }}
          >
            {Row}
          </FixedSizeList>
        )}
      </AutoSizer>
    </div>
  )
}
