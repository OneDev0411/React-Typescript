import { useCallback } from 'react'

import { makeStyles, Theme } from '@material-ui/core'
import cn from 'classnames'

import Table from '@app/views/components/Grid/Table'
import { useGridStyles } from '@app/views/components/Grid/Table/styles/default'
import type { LoadingPosition } from '@app/views/components/Grid/Table/types'

import { useInsightsContext } from '../../context/use-insights-context'
import { useInsights } from '../queries/use-insights'

import { LoadingSkeleton } from './LoadingSkeleton'
import { LoadingState } from './LoadingState'
import { useColumns } from './use-columns'

const useStyles = makeStyles(
  (theme: Theme) => ({
    row: {
      '& .column:not(.heading)': {
        padding: theme.spacing(0, 1, 0, 2)
      },
      '& .column:not(.heading):first-child': {
        paddingLeft: `${theme.spacing(2)}px !important`
      },
      '& .column:not(.heading) .overflow-ellipsis': {
        whiteSpace: 'nowrap',
        overflow: 'hidden',
        textOverflow: 'ellipsis'
      }
    }
  }),
  { name: 'InsightsTable' }
)

export function InsightsTable() {
  const columns = useColumns()
  const classes = useStyles()
  const gridClasses = useGridStyles()
  const { sortBy } = useInsightsContext()

  const { list, isLoading, fetchNextPage, isFetchingNextPage } = useInsights()

  const getLoadingPosition = useCallback((): LoadingPosition => {
    if (isFetchingNextPage) {
      return 'bottom'
    }

    return null
  }, [isFetchingNextPage])

  return isLoading ? (
    <LoadingSkeleton columns={columns} classes={classes} />
  ) : (
    <Table<IEmailCampaign<'template'>>
      rows={list}
      totalRows={list?.length}
      columns={columns}
      headless={false}
      infiniteScrolling={{
        onReachStart: () => {},
        onReachEnd: fetchNextPage
      }}
      classes={{
        row: cn(gridClasses.row, classes.row)
      }}
      sorting={{
        sortBy: {
          value: sortBy.value,
          ascending: sortBy.ascending
        }
      }}
      loading={getLoadingPosition()}
      LoadingStateComponent={LoadingState}
    />
  )
}
