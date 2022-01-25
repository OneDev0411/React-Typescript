import { TableColumn, RenderProps, GridSelectionOptions } from '../../types'

import ToggleRow from './ToggleRow'

export function useRowsSelection<Row>(
  columns: TableColumn<Row>[],
  rows: Row[],
  options: GridSelectionOptions<Row>
): {
  columns: TableColumn<Row>[]
  rows: Row[]
} {
  const newColumns = [
    {
      id: 'row-selection',
      width: 'auto', // default value
      ...(options.columnProps || {}),
      render: (rowItem: RenderProps<Row>) => {
        return (
          <ToggleRow
            rowItem={rowItem}
            render={options.render}
            defaultRender={options.defaultRender}
          />
        )
      }
    },
    ...columns
  ]

  return {
    columns: newColumns,
    rows
  }
}
