import { SELECTION__TOGGLE_ENTIRE_ROWS } from '../../../context/constants'
import { useGridContext } from '../../../hooks/use-grid-context'
import { ColumnHeaderProps } from '../../../types'
import Checkbox from '../Checkbox'

export function SelectionHeaderColumn<Row>(data: ColumnHeaderProps<Row>) {
  const [state, dispatch] = useGridContext()
  const {
    selection: { selectedRowIds, isAllRowsSelected, isEntireRowsSelected }
  } = state

  const handleChange = () => {
    dispatch({
      type: SELECTION__TOGGLE_ENTIRE_ROWS
    })
  }

  return (
    <Checkbox
      checked={isEntireRowsSelected || isAllRowsSelected}
      indeterminate={selectedRowIds.length > 0}
      onChange={handleChange}
    />
  )
}
