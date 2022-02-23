import { alpha, makeStyles, Theme } from '@material-ui/core'

import { SELECTION__TOGGLE_ENTIRE_ROWS } from '../../../context/constants'
import { useGridContext } from '../../../hooks/use-grid-context'
import Checkbox from '../Checkbox'

const useStyles = makeStyles(
  (theme: Theme) => ({
    container: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'flex-end',
      overflow: 'initial',
      width: '60px',
      minWidth: '60px',
      paddingRight: theme.spacing(0.5),
      flex: '0 0 60px',

      borderTop: `1px solid ${theme.palette.divider}`,
      borderBottom: `1px solid ${theme.palette.divider}`,

      backgroundColor: `${alpha(theme.palette.grey[50], 0.75)}`,
      cursor: 'pointer',

      '&:hover': {
        backgroundColor: `${alpha(theme.palette.grey[100], 0.75)}`
      }
    }
  }),
  { name: 'ToggleEntireRows' }
)

interface Props<Row> {
  rows: Row[]
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

  const allRowsSelected =
    isAllRowsSelected ||
    selectedRowIds.length === rows.length ||
    (isEntireRowsSelected && excludedRows.length === 0)

  const someRowsSelected =
    (isAllRowsSelected === false &&
      selectedRowIds.length > 0 &&
      selectedRowIds.length < rows.length) ||
    (isEntireRowsSelected && excludedRows.length > 0)

  const verbText =
    allRowsSelected || isEntireRowsSelected ? 'Deselect' : 'Select'
  const disableCheckbox = Number(rows.length) === 0
  const defaultSelectAllValue =
    Number(rows.length) === 0 ? false : allRowsSelected

  const handleToggleEntireRows = () => {
    dispatch({
      type: SELECTION__TOGGLE_ENTIRE_ROWS
    })
  }

  return (
    <div className={classes.container}>
      <Checkbox
        size="small"
        disableRipple
        tooltipTitle={`${verbText} all ${totalRows} Rows`}
        disabled={disableCheckbox}
        checked={defaultSelectAllValue}
        indeterminate={someRowsSelected}
        onChange={handleToggleEntireRows}
        data-tour-id="select-deselect-checkbox"
      />
    </div>
  )
}
