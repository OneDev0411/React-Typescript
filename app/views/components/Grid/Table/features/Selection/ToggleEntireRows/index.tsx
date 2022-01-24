import { makeStyles, Theme } from '@material-ui/core'

import { SELECTION__TOGGLE_ENTIRE_ROWS } from '../../../context/constants'
import { useGridContext } from '../../../hooks/use-grid-context'
import Checkbox from '../Checkbox'

const useStyles = makeStyles(
  (theme: Theme) => ({
    container: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'end',
      overflow: 'initial',
      width: theme.spacing(7.5),
      paddingRight: theme.spacing(0.5)
    }
  }),
  { name: 'ToggleEntireRows' }
)

interface Props<Row> {
  rows: (Row & { id?: UUID })[]
  totalRows: number
}

export function ToggleEntireRows<Row>({ rows, totalRows }: Props<Row>) {
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

  const verbText = isAllSelected || isEntireRowsSelected ? 'Deselect' : 'Select'

  const handleToggleEntireRows = () => {
    dispatch({
      type: SELECTION__TOGGLE_ENTIRE_ROWS
    })
  }

  const defaultSelectAllValue =
    Number(rows.length) === 0 ? false : isAllSelected

  const isSelectAllDisable = Number(rows.length) === 0

  if (rows && rows.length === totalRows) {
    return null
  }

  return (
    <div className={classes.container}>
      <Checkbox
        size="small"
        disableRipple
        tooltipTitle={`${verbText} all ${totalRows} Rows`}
        disabled={isSelectAllDisable}
        checked={defaultSelectAllValue}
        indeterminate={isSomeRowsSelected}
        onChange={handleToggleEntireRows}
        data-tour-id="select-deselect-checkbox"
      />
    </div>
  )
}
