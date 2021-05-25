export function getRowId<Row>(row: Row & { id?: UUID }, rowIndex: number) {
  return row.id || rowIndex.toString()
}
