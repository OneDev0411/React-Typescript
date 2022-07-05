import { makeStyles, Theme } from '@material-ui/core'
import useEffectOnce from 'react-use/lib/useEffectOnce'

import { Props } from '..'
import { Body } from '../Body'
import { setActiveSort } from '../context/actions/sorting/set-active-sort'
import { Actions } from '../features/Actions'
import { useRowsSelection } from '../features/Selection/use-row-selection'
import { Sorting } from '../features/Sorting'
import { useRowsSorting } from '../features/Sorting/use-row-sorting'
import { useGridContext } from '../hooks/use-grid-context'
import { useTable } from '../hooks/use-table'
import { GridHookPlugin, LoadingPosition } from '../types'

const useStyles = makeStyles(
  (theme: Theme) => ({
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
      position: 'relative'
    },
    loading: ({ loading }: { loading: LoadingPosition }) => {
      if (loading === 'static') {
        return {}
      }

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
  }),
  { name: 'GridTable' }
)

export function GridTable<Row>({
  columns,
  rows,
  totalRows,
  getTdProps,
  getTrProps,
  virtualize = true,
  rowSize,
  headless = true,
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

  const { columns: nextColumns, rows: nextRows } = useTable<Row>(
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

      <div className={gridClasses.tableContainer}>
        {rows && rows.length > 0 && (
          <Body<Row>
            columns={nextColumns}
            rows={nextRows}
            classes={classes}
            virtualize={virtualize}
            totalRows={totalRows}
            rowSize={rowSize}
            headless={headless}
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
        rows={nextRows}
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
