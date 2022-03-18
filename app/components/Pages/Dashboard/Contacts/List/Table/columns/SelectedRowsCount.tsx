import { HeaderColumn } from '@app/views/components/Grid/Table/features/HeaderColumn'
import { useGridContext } from '@app/views/components/Grid/Table/hooks/use-grid-context'

interface Props {
  totalRows: number
}

export function SelectedRowsCount({ totalRows }: Props) {
  const [state] = useGridContext()

  const getText = () => {
    if (
      state.selection.isAllRowsSelected ||
      state.selection.isEntireRowsSelected
    ) {
      return [`${totalRows}/${totalRows}`, 'selected']
    }

    if (state.selection.selectedRowIds.length > 0) {
      return [
        `${state.selection.selectedRowIds.length}/${totalRows}`,
        'selected'
      ]
    }

    return [`${totalRows}`, 'contacts']
  }

  const text = getText()

  return (
    <HeaderColumn
      text={
        <div>
          <strong>{text[0]}</strong> {text[1]}
        </div>
      }
    />
  )
}
