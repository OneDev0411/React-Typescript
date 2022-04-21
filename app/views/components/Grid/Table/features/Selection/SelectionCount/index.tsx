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
      return [`${totalRows}/${totalRows}`, 'Selected']
    }

    if (selection.isEntireRowsSelected && selection.excludedRows.length > 0) {
      return [
        `${totalRows - selection.excludedRows.length}/${totalRows}`,
        'Selected'
      ]
    }

    if (selection.selectedRowIds.length > 0) {
      return [`${selection.selectedRowIds.length}/${totalRows}`, 'Selected']
    }

    return [`${totalRows}`, 'Contacts']
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
