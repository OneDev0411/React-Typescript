import React, { useRef, ComponentProps, useEffect } from 'react'
import { Theme } from '@material-ui/core'

import AutoSizer from 'react-virtualized-auto-sizer'
import { useWindowSize, useWindowScroll } from 'react-use'

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
  const [state] = useGridContext()

  const { height: windowHeight } = useWindowSize()
  const { y: scrollTop } = useWindowScroll()

  const listRef = useRef<FixedSizeList>(null)

  useEffect(() => {
    listRef.current && listRef.current.scrollTo(scrollTop)
  }, [scrollTop])

  return (
    <div style={{ height: '100%' }}>
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
