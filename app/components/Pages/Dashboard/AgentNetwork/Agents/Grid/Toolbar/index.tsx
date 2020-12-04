import React from 'react'

import { useGridContext } from 'components/Grid/Table/hooks/use-grid-context'

export function TableToolbar() {
  const [state /* , dispatch */] = useGridContext()

  return <div>{state.selection.selectedRowIds.length}</div>
}
