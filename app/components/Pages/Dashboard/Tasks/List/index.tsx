import cn from 'classnames'

import Table from '@app/views/components/Grid/Table'
import { useGridBorderedStyles } from '@app/views/components/Grid/Table/styles/bordered'
import { useGridStyles } from '@app/views/components/Grid/Table/styles/default'

import { useTasks } from '../queries/use-tasks'

import { useColumns } from './use-columns'

export function List() {
  const columns = useColumns()
  const gridClasses = useGridStyles()
  const gridBorderedClasses = useGridBorderedStyles()
  const { isLoading, data } = useTasks()

  console.log('!!', data)

  return (
    <Table<ICRMTask<'assignees' | 'associations'>>
      headless={false}
      rowSize={5}
      selection={{
        columnProps: {
          width: '80px'
        },
        showSelectAll: false
      }}
      classes={{
        row: cn(gridClasses.row, gridBorderedClasses.row)
      }}
      totalRows={0}
      columns={columns}
      rows={data}
    />
  )
}
