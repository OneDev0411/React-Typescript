import { makeStyles, Theme } from '@material-ui/core'
import cn from 'classnames'

import Table from '@app/views/components/Grid/Table'
import { useGridBorderedStyles } from '@app/views/components/Grid/Table/styles/bordered'
import { useGridStyles } from '@app/views/components/Grid/Table/styles/default'

import { useTasks } from '../queries/use-tasks'

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

export function List() {
  const columns = useColumns()
  const classes = useStyles()
  const gridClasses = useGridStyles()
  const gridBorderedClasses = useGridBorderedStyles()
  const { isLoading, data } = useTasks()

  return (
    <Table<ICRMTask<'assignees' | 'associations'>>
      headless={false}
      rowSize={5}
      selection={{
        columnProps: {
          width: '65px'
        },
        showSelectAll: false
      }}
      classes={{
        row: cn(gridClasses.row, gridBorderedClasses.row, classes.row)
      }}
      totalRows={0}
      columns={columns}
      rows={data}
    />
  )
}
