import { useCallback } from 'react'

import { makeStyles, Theme } from '@material-ui/core'
import cn from 'classnames'

import Table from '@app/views/components/Grid/Table'
import { useGridBorderedStyles } from '@app/views/components/Grid/Table/styles/bordered'
import { useGridStyles } from '@app/views/components/Grid/Table/styles/default'
import type { LoadingPosition } from '@app/views/components/Grid/Table/types'

import { useTasks } from '../queries/use-tasks'

import { LoadingSkeleton } from './LoadingSkeleton'
import { LoadingState } from './LoadingState'
import { useColumns } from './use-columns'

export const useStyles = makeStyles(
  (theme: Theme) => ({
    row: {
      '& .column': {
        padding: theme.spacing(0, 1, 0, 2)
      },
      '& .column div': {
        width: '100%',
        whiteSpace: 'nowrap',
        overflow: 'hidden',
        textOverflow: 'ellipsis'
      }
    }
  }),
  {
    name: 'Tasks-Table-Columns'
  }
)

export function TasksTable() {
  const classes = useStyles()
  const gridClasses = useGridStyles()
  const gridBorderedClasses = useGridBorderedStyles()

  const columns = useColumns()

  const { isLoading, tasks, fetchNextPage, isFetchingNextPage } = useTasks()

  const getLoadingPosition = useCallback((): LoadingPosition => {
    if (isFetchingNextPage) {
      return 'bottom'
    }

    return null
  }, [isFetchingNextPage])

  return isLoading ? (
    <LoadingSkeleton columns={columns} classes={classes} />
  ) : (
    <Table<ICRMTask<'assignees' | 'associations'>>
      headless={false}
      rowSize={5}
      selection={{
        columnProps: {
          width: '65px'
        }
      }}
      classes={{
        row: cn(gridClasses.row, gridBorderedClasses.row, classes.row)
      }}
      totalRows={tasks?.length ?? 0}
      columns={columns}
      rows={tasks}
      infiniteScrolling={{
        onReachStart: () => {},
        onReachEnd: fetchNextPage
      }}
      loading={getLoadingPosition()}
      LoadingStateComponent={LoadingState}
    />
  )
}
