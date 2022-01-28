import { makeStyles } from '@material-ui/core'
import cn from 'classnames'

import { SELECTION__TOGGLE_ROW } from '../../../context/constants/selection'
import { getRowId } from '../../../helpers/get-row-id'
import { useGridContext } from '../../../hooks/use-grid-context'
import { RenderProps } from '../../../types'
import Checkbox from '../Checkbox'
import { isRowSelected } from '../helpers/is-row-selected'

const useStyles = makeStyles(
  theme => ({
    container: {
      display: 'flex',
      justifyContent: 'end',
      alignItems: 'center',
      width: theme.spacing(7.5),
      borderBottom: `1px solid ${theme.palette.divider}`,
      height: '100%',
      paddingRight: '4px',
      overflow: 'initial'
    },
    showDefault: {
      display: 'block'
    },
    hideDefault: {
      display: 'none'
    }
  }),
  { name: 'ToggleRow' }
)

interface Props<Row> {
  rowItem: RenderProps<Row>
  render?: ((rowItem: RenderProps<Row>) => React.ReactNode) | null
  defaultRender?: ((rowItem: RenderProps<Row>) => React.ReactNode) | null
}

function ToggleRow<Row>({ rowItem, render, defaultRender }: Props<Row>) {
  const [state, dispatch] = useGridContext()
  const classes = useStyles()

  const handleToggleRow = (rowItem: RenderProps<Row>): void => {
    const rowId = getRowId<Row>(rowItem.row, rowItem.rowIndex)

    dispatch({
      type: SELECTION__TOGGLE_ROW,
      id: rowId,
      totalRows: rowItem.totalRows
    })
  }

  const selectionCheckBox = () => {
    if (render) {
      return render(rowItem)
    }

    return (
      <Checkbox
        size="small"
        checked={isRowSelected<Row>(state, rowItem.row, rowItem.rowIndex)}
        onChange={() => handleToggleRow(rowItem)}
      />
    )
  }

  const showDefaultValue =
    defaultRender &&
    state.selection.selectedRowIds.length === 0 &&
    !state.selection.isAllRowsSelected &&
    !state.selection.isEntireRowsSelected

  return (
    <div className={classes.container}>
      <div
        className={cn('selection--default-value', {
          [classes.showDefault]: showDefaultValue,
          [classes.hideDefault]: !showDefaultValue
        })}
      >
        {defaultRender && defaultRender(rowItem)}
      </div>

      <div
        className={cn('selection--checkbox', {
          [classes.showDefault]: !showDefaultValue,
          [classes.hideDefault]: showDefaultValue
        })}
        onClick={e => e.stopPropagation()}
      >
        {selectionCheckBox()}
      </div>
    </div>
  )
}

export default ToggleRow
