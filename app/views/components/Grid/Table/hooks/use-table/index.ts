import { TableColumn, GridHookPlugin } from '../../types'

export function useTable<Row>(
  columns: TableColumn<Row>[],
  rows: Row[],
  plugins: [GridHookPlugin<Row, object>, object][]
) {
  return plugins.reduce(
    (acc, plugin) => {
      const [fn, options] = plugin

      return fn(acc.columns, acc.rows, options)
    },
    {
      columns,
      rows
    }
  )
}
