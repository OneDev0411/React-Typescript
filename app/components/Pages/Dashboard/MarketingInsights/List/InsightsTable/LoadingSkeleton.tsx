import { useMemo } from 'react'

import { Skeleton } from '@material-ui/lab'
import { ClassNameMap } from '@material-ui/styles'
import cn from 'classnames'

import { Table } from '@app/views/components/Grid/Table'
import { useGridBorderedStyles } from '@app/views/components/Grid/Table/styles/bordered'
import { useGridStyles } from '@app/views/components/Grid/Table/styles/default'
import { TableColumn } from '@app/views/components/Grid/Table/types'

const Rows = Array.from({ length: 30 }).map(() => ({}))

interface Props {
  classes: ClassNameMap<'row'>
  columns: TableColumn<IEmailCampaign<'template'>>[]
}

export function LoadingSkeleton({ columns, classes }: Props) {
  const gridClasses = useGridStyles()
  const gridBorderedClasses = useGridBorderedStyles()

  const skeletonColumns = useMemo(
    () =>
      columns.map(column => ({
        ...column,
        render: () => <Skeleton variant="text" width="50%" />,
        renderInlineEdit: undefined
      })),
    [columns]
  )

  return (
    <Table
      headless={false}
      rowSize={5}
      classes={{
        row: cn(gridClasses.row, gridBorderedClasses.row, classes.row)
      }}
      totalRows={50}
      columns={skeletonColumns}
      rows={Rows}
    />
  )
}
