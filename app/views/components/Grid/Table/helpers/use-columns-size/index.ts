import { useMemo } from 'react'

import { TableColumn } from '../../types'

export function useColumnsSize<Row>(columns: TableColumn<Row>[]): string[] {
  return useMemo(() => {
    const renderableColumns = columns.filter(
      col => (col.render || col.accessor) && col.hidden !== true
    )
    const sizelessColumns = renderableColumns.filter(col => !col.width)

    const calc = renderableColumns
      .filter(col => col.width)
      .map(col => col.width)
      .join(' + ')

    return renderableColumns.map(
      col => col.width || `calc((100% - (${calc})) / ${sizelessColumns.length})`
    )
  }, [columns])
}
