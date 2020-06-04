import React from 'react'
import { makeStyles, createStyles, Theme } from '@material-ui/core'

import useEffectOnce from 'react-use/lib/useEffectOnce'

import { Sorting } from '../features/Sorting'
import { Actions } from '../features/Actions'

import { Body } from '../Body'
import { useTable } from '../hooks/use-table'

import { useRowsSelection } from '../features/Selection/use-row-selection'
import { useRowsSorting } from '../features/Sorting/use-row-sorting'

import { GridHookPlugin, LoadingPosition } from '../types'

import { useGridContext } from '../hooks/use-grid-context'

import { setActiveSort } from '../context/actions/sorting/set-active-sort'

import { Props } from '..'

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    headerContainer: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between'
    },
    summary: {
      margin: theme.spacing(1, 0),
      color: theme.palette.grey[700]
    },
    tableContainer: {
      height: '100%'
    },
    loading: ({ loading }: { loading: LoadingPosition }) => {
      let top: number | string = '50%'

      if (loading === 'top') {
        top = 0
      }

      if (loading === 'bottom') {
        top = '100%'
      }

      return {
        position: 'absolute',
        width: '100%',
        top,
        left: 0
      }
    }
  })
)

export function GridTable<Row>({
  columns,
  rows,
  totalRows,
  getTdProps,
  getTrProps,
  virtualize = true,
  summary = null,
  loading = null,
  selection = null,
  sorting = null,
  infiniteScrolling = null,
  TableActions = null,
  ToolbarComponent = null,
  LoadingStateComponent = null,
  EmptyStateComponent = null,
  classes = {}
}: Props<Row>) {
  const gridClasses = useStyles({ loading })
  const [state, dispatch] = useGridContext()

  useEffectOnce(() => {
    if (sorting && sorting.defaultSort) {
      dispatch(setActiveSort(sorting.defaultSort))
    }
  })

  const plugins: [GridHookPlugin<Row, object>, object][] = []

  if (selection) {
    plugins.push([useRowsSelection, selection])
  }

  if (sorting) {
    plugins.push([useRowsSorting, sorting])
  }

  const { columns: newColumns, rows: newRows } = useTable<Row>(
    columns,
    rows,
    plugins
  )

  return (
    <>
      {(ToolbarComponent || (sorting && sorting.columns)) && (
        <div className={gridClasses.headerContainer}>
          <div>{ToolbarComponent}</div>

          {rows && rows.length > 0 && (
            <div>
              <Sorting<Row> columns={columns} options={sorting} />
            </div>
          )}
        </div>
      )}

      {rows && rows.length === 0 && !loading && EmptyStateComponent && (
        <EmptyStateComponent />
      )}

      {summary && !loading && (
        <div className={gridClasses.summary}>{summary(totalRows, state)}</div>
      )}

      <div className="tableContainer">
        {rows && rows.length > 0 && (
          <Body<Row>
            columns={newColumns}
            rows={newRows}
            classes={classes}
            virtualize={virtualize}
            getTdProps={getTdProps}
            getTrProps={getTrProps}
            infiniteScrolling={infiniteScrolling}
          />
        )}

        {loading && LoadingStateComponent && (
          <div className={gridClasses.loading}>
            <LoadingStateComponent />
          </div>
        )}
      </div>

      <Actions<Row>
        rows={newRows}
        totalRows={totalRows}
        showSelectAll={
          selection && selection.showSelectAll !== undefined
            ? selection.showSelectAll
            : true
        }
        TableActions={TableActions}
      />
    </>
  )
}
