import { useCallback } from 'react'

import { makeStyles, Theme } from '@material-ui/core'
import cn from 'classnames'

import Table from '@app/views/components/Grid/Table'
import { useGridBorderedStyles } from '@app/views/components/Grid/Table/styles/bordered'
import { useGridStyles } from '@app/views/components/Grid/Table/styles/default'
import type { LoadingPosition } from '@app/views/components/Grid/Table/types'

import { useInsights } from '../queries/use-insights'

import { LoadingSkeleton } from './LoadingSkeleton'
import { LoadingState } from './LoadingState'
import { useColumns } from './use-columns'

const useStyles = makeStyles(
  (theme: Theme) => ({
    row: {}
  }),
  { name: 'InsightsList' }
)

export function InsightsTable() {
  const columns = useColumns()
  const classes = useStyles()
  const gridClasses = useGridStyles()
  const gridBorderedClasses = useGridBorderedStyles()

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
        row: cn(gridClasses.row, gridBorderedClasses.row, classes.row)
      }}
      loading={getLoadingPosition()}
      LoadingStateComponent={LoadingState}
    />
  )
}
