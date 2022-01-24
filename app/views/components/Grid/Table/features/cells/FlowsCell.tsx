import { makeStyles, Tooltip } from '@material-ui/core'
import cn from 'classnames'

import AddToFlowButton from 'components/AddToFlowButton'

import { CellProps } from '../../types'

import CellContainer from './CellContainer'

const useStyles = makeStyles(
  theme => ({
    button: {
      ...theme.typography.body3,
      color: theme.palette.grey[700],
      letterSpacing: '0.15px',
      lineHeight: `${theme.spacing(3)}px`,

      display: 'inline-flex',
      alignItems: 'center',
      cursor: 'pointer'
    },
    text: {
      ...theme.typography.body2,
      color: theme.palette.grey[700],
      letterSpacing: '0.15px',
      lineHeight: `${theme.spacing(3)}px`,
      '&.hovered': {
        color: theme.palette.tertiary.dark
      },
      '&.selected': {
        color: theme.palette.tertiary.dark
      },
      '&.rowSelected': {
        color: theme.palette.tertiary.dark
      }
    }
  }),
  { name: 'Flows-cell' }
)

//----

interface Props {
  contact: IContact
  callback: () => void
  flowsCount: number
  isRowSelected?: boolean
}

const FlowsCell = ({
  contact,
  callback,
  flowsCount,
  isRowSelected = false
}: Props) => {
  const classes = useStyles()

  const renderCellContent = ({
    isHovered = false,
    isSelected = false
  }: CellProps) => {
    if (flowsCount === 0) {
      return (
        <AddToFlowButton
          contacts={{ ids: [contact.id] }}
          callback={callback}
          buttonRenderer={({ className, ...buttonProps }) => (
            <Tooltip title="Click to add to flow">
              <span className={cn(className, classes.button)} {...buttonProps}>
                Add to flow
              </span>
            </Tooltip>
          )}
        />
      )
    }

    return (
      <div
        className={cn(classes.text, {
          hovered: isHovered,
          selected: isSelected,
          rowSelected: isRowSelected
        })}
      >
        {`in ${flowsCount} flow${flowsCount === 1 ? '' : 's'}`}
      </div>
    )
  }

  return <CellContainer renderCellContent={renderCellContent} />
}

export default FlowsCell
