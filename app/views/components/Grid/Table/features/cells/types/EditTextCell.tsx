import { makeStyles } from '@material-ui/core'
import cn from 'classnames'

import { TextInlineEdit } from '@app/views/components/Grid/Table/features/inline-edit/Text'

import { CellProps } from '../../../types'
import { CellContainer } from '../CellContainer'

const useStyles = makeStyles(
  theme => ({
    container: {
      height: '100%',
      width: '100%'
    },
    cellText: {
      color: theme.palette.grey[700],
      ...theme.typography.body2,
      lineHeight: `${theme.spacing(3)}px`
    },
    primaryText: {
      color: theme.palette.tertiary.dark
    },
    hoveredText: {
      color: theme.palette.tertiary.dark
    },
    selectedText: {
      color: theme.palette.primary.main
    },
    rowSelectedText: {
      color: theme.palette.tertiary.dark
    }
  }),
  { name: 'EditTextCell' }
)

interface Props {
  text?: string
  isPrimary?: boolean
  isRowSelected?: boolean
  onCellSelect?: (e) => void
  width: number | string
}

export const EditTextCell = ({
  text = '',
  isPrimary = false,
  isRowSelected = false,
  width
}: Props) => {
  const classes = useStyles()

  const renderCellContent = ({
    isHovered = false,
    isSelected = false
  }: CellProps) => (
    <div
      className={cn(classes.cellText, {
        [classes.primaryText]: isPrimary,
        [classes.hoveredText]: isHovered,
        [classes.selectedText]: isSelected,
        [classes.rowSelectedText]: isRowSelected
      })}
    >
      {text}
    </div>
  )

  const renderInlineEdit = () => (
    <TextInlineEdit value={text} isSaving={false} onSave={e => null} />
  )

  return (
    <CellContainer
      isSelectable={false}
      actionsActivated={false}
      width={width}
      renderCellContent={renderCellContent}
      renderInlineEdit={renderInlineEdit}
    />
  )
}
