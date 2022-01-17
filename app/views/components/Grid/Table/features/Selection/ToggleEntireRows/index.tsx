import { makeStyles, Theme } from '@material-ui/core'

import { SELECTION__TOGGLE_ENTIRE_ROWS } from '../../../context/constants'
import { useGridContext } from '../../../hooks/use-grid-context'
import Checkbox from '../Checkbox'

const useStyles = makeStyles(
  (theme: Theme) => ({
    container: {
      padding: theme.spacing(1, 0.5, 1, 4),
      overflow: 'initial'
    }
  }),
  { name: 'ColumnSelector' }
)

interface Props<Row> {
  rows: (Row & { id?: UUID })[]
}

export function ToggleEntireRows<Row>({ rows }: Props<Row>) {
  const classes = useStyles()
  const [state, dispatch] = useGridContext()
  const {
    isAllRowsSelected,
    isEntireRowsSelected,
    selectedRowIds,
    excludedRows
  } = state.selection

  const isAllSelected =
    isAllRowsSelected ||
    selectedRowIds.length === rows.length ||
    (isEntireRowsSelected && excludedRows.length === 0)

  const isSomeRowsSelected =
    (isAllRowsSelected === false &&
      selectedRowIds.length > 0 &&
      selectedRowIds.length < rows.length) ||
    (isEntireRowsSelected && excludedRows.length > 0)

  const tooltipTitle =
    isAllSelected || isEntireRowsSelected
      ? 'Deselect All Rows'
      : 'Select All Rows'

  const handleToggleEntireRows = () => {
    dispatch({
      type: SELECTION__TOGGLE_ENTIRE_ROWS
    })
  }

  const defaultSelectAllValue =
    Number(rows.length) === 0 ? false : isAllSelected

  const isSelectAllDisable = Number(rows.length) === 0

  return (
    <div className={classes.container}>
      <Checkbox
        size="small"
        disableRipple
        tooltipTitle={tooltipTitle}
        disabled={isSelectAllDisable}
        checked={defaultSelectAllValue}
        indeterminate={isSomeRowsSelected}
        onChange={handleToggleEntireRows}
        data-tour-id="select-deselect-checkbox"
      />
    </div>
  )
}
