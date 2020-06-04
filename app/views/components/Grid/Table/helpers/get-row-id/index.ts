export function getRowId<Row>(row: Row & { id?: string }, rowIndex: number) {
  return row.id || rowIndex.toString()
}
