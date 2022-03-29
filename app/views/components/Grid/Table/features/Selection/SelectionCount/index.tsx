import { useGridContext } from '../../../hooks/use-grid-context'
import { HeaderColumn } from '../../HeaderColumn'

interface Props {
  totalRows: number
}

export function SelectionCount({ totalRows }: Props) {
  const [state] = useGridContext()

  const getText = () => {
    const { selection } = state

    if (selection.isEntireRowsSelected && selection.excludedRows.length === 0) {
      return [`${totalRows}/${totalRows}`, 'selected']
    }

    if (selection.isEntireRowsSelected && selection.excludedRows.length > 0) {
      return [
        `${totalRows - selection.excludedRows.length}/${totalRows}`,
        'selected'
      ]
    }

    if (selection.selectedRowIds.length > 0) {
      return [`${selection.selectedRowIds.length}/${totalRows}`, 'selected']
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
