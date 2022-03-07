import { makeStyles, Tooltip } from '@material-ui/core'
import cn from 'classnames'

import AddToFlowButton from 'components/AddToFlowButton'

import { CellProps } from '../../types'

import { CellContainer } from './CellContainer'

const useStyles = makeStyles(
  theme => ({
    text: {
      ...theme.typography.body2,
      color: theme.palette.grey[700],
      lineHeight: `${theme.spacing(3)}px`
    },
    textHovered: {
      color: theme.palette.tertiary.dark
    },
    textSelected: {
      color: theme.palette.tertiary.dark
    },
    textRowSelected: {
      color: theme.palette.tertiary.dark
    }
  }),
  { name: 'FlowsCell' }
)

interface Props {
  contact: IContact
  callback: () => void
  isRowSelected?: boolean
  width: number | string
}

const FlowsCell = ({
  contact,
  callback,
  isRowSelected = false,
  width
}: Props) => {
  const classes = useStyles()

  const flowsCount = Array.isArray(contact.flows) ? contact.flows.length : 0

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
                [classes.textHovered]: isHovered,
                [classes.textSelected]: isSelected,
                [classes.textRowSelected]: isRowSelected
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

  return (
    <CellContainer
      renderCellContent={renderCellContent}
      width={width}
      stopPropagation
    />
  )
}

export default FlowsCell
