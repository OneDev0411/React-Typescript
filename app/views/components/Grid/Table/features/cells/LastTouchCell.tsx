import { createStyles, makeStyles, Theme, Tooltip } from '@material-ui/core'
import cn from 'classnames'
import timeago from 'timeago.js'

import { CellProps } from '../../types'

import { CellContainer } from './CellContainer'

const useStyles = makeStyles(
  (theme: Theme) =>
    createStyles({
      noTouch: {
        ...theme.typography.body2,
        lineHeight: `${theme.spacing(3)}px`,
        color: theme.palette.grey[700]
      },
      hovered: {
        color: theme.palette.tertiary.dark
      },
      selected: {
        color: theme.palette.primary.main
      },
      rowSelected: {
        color: theme.palette.tertiary.dark
      },
      lastTouchValue: {
        ...theme.typography.body2,
        lineHeight: `${theme.spacing(3)}px`,
        color: theme.palette.grey[700]
      }
    }),
  { name: 'LastTouchCell' }
)

interface Props {
  contact: IContact
  onSave?: (e: any) => void
  isRowSelected?: boolean
  width: number | string
}

export const LastTouchCell = ({
  contact,
  isRowSelected = false,
  width
}: Props) => {
  const classes = useStyles()

  const renderCellContent = ({
    isHovered = false,
    isSelected = false
  }: CellProps) => {
    const { last_touch: lastTouch, next_touch: nextTouch } = contact

    if (!lastTouch) {
      return (
        <div
          className={cn(classes.noTouch, {
            [classes.rowSelected]: isRowSelected,
            [classes.hovered]: isHovered,
            [classes.selected]: isSelected
          })}
        >
          No touches
        </div>
      )
    }

    const formattedLastTouch = timeago().format(lastTouch * 1000)

    const content = () => (
      <div
        className={cn(classes.lastTouchValue, {
          rowSelected: isRowSelected,
          hovered: isHovered,
          selected: isSelected
        })}
      >
        {formattedLastTouch}
      </div>
    )

    if (nextTouch) {
      return (
        <Tooltip
          title={
            <span>
              You wanted to be in touch
              <br />
              every {Math.round((nextTouch - lastTouch) / 86400)} days.
            </span>
          }
        >
          {content()}
        </Tooltip>
      )
    }

    return content()
  }

  return <CellContainer renderCellContent={renderCellContent} width={width} />
}
