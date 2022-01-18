import { makeStyles } from '@material-ui/core'

import { useGridContext } from '../../../hooks/use-grid-context'
import { RenderProps } from '../../../types'
import Checkbox from '../Checkbox'
import { isRowSelected } from '../helpers/is-row-selected'

const useStyles = makeStyles(
  theme => ({
    container: {
      padding: theme.spacing(1, 0.5, 1, 4),
      overflow: 'initial'
    }
  }),
  { name: 'ToggleRow' }
)

interface Props<Row> {
  rowItem: RenderProps<Row>
  render?: ((rowItem: RenderProps<Row>) => React.ReactNode) | null
  defaultRender?: ((rowItem: RenderProps<Row>) => React.ReactNode) | null
  handleToggleRow: (props: RenderProps<Row>) => void
}

function ToggleRow<Row>({
  rowItem,
  render,
  defaultRender,
  handleToggleRow
}: Props<Row>) {
  const [state] = useGridContext()
  const classes = useStyles()

  const showDefaultValue =
    defaultRender &&
    state.selection.selectedRowIds.length === 0 &&
    !state.selection.isAllRowsSelected &&
    !state.selection.isEntireRowsSelected

  return (
    <div className={classes.container}>
      <div
        className="selection--default-value"
        style={{
          display: showDefaultValue ? 'block' : 'none'
        }}
      >
        {defaultRender && defaultRender(rowItem)}
      </div>

      <div
        className="selection--checkbox"
        style={{ display: showDefaultValue ? 'none' : 'block' }}
        onClick={e => e.stopPropagation()}
      >
        {render ? (
          render(rowItem)
        ) : (
          <Checkbox
            size="small"
            checked={isRowSelected<Row>(state, rowItem.row, rowItem.rowIndex)}
            onChange={() => handleToggleRow(rowItem)}
          />
        )}
      </div>
    </div>
  )
}

export default ToggleRow
