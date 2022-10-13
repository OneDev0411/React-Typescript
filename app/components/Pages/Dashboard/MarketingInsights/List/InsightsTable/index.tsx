import { makeStyles, Theme } from '@material-ui/core'
import cn from 'classnames'

import Table from '@app/views/components/Grid/Table'
import { useGridStyles } from '@app/views/components/Grid/Table/styles/default'

import { useInsights } from '../queries/use-insights'

import { useColumns } from './use-columns'

const useStyles = makeStyles(
  (theme: Theme) => ({
    row: {}
  }),
  { name: 'InsightsList' }
)

export function InsightsTable() {
  const columns = useColumns()
  const customGridClasses = useStyles()
  const gridClasses = useGridStyles()
  const { list } = useInsights()

  console.log('###', list)

  return <div>+</div>
  // return (
  //   <Table<IEmailCampaign[]>
  //     rows={list}
  //     totalRows={list?.length}
  //     columns={columns}
  //     classes={{
  //       row: cn(gridClasses.row, customGridClasses.row)
  //     }}
  //   />
  // )
}
