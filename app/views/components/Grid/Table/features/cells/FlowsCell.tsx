import { makeStyles, Tooltip } from '@material-ui/core'
import cn from 'classnames'

import AddToFlowButton from 'components/AddToFlowButton'

import { CellProps } from '../../types'

import CellContainer from './CellContainer'

const useStyles = makeStyles(
  theme => ({
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
    return (
      <AddToFlowButton
        contacts={{ ids: [contact.id] }}
        callback={callback}
        buttonRenderer={({ className, ...buttonProps }) => (
          <Tooltip title="Click to add to flow">
            <div
              className={cn(className, classes.text, {
                hovered: isHovered,
                selected: isSelected,
                rowSelected: isRowSelected
              })}
              {...buttonProps}
            >
              {flowsCount === 0 && 'Add to flow'}
              {flowsCount > 0 &&
                `in ${flowsCount} flow${flowsCount === 1 ? '' : 's'}`}
            </div>
          </Tooltip>
        )}
      />
    )
  }

  return <CellContainer renderCellContent={renderCellContent} />
}

export default FlowsCell
