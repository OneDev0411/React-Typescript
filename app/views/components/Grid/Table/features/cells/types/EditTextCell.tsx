import { makeStyles } from '@material-ui/core'
import cn from 'classnames'

import { TextInlineEdit } from '@app/views/components/Grid/Table/features/inline-edit/Text'

import { CellProps } from '../../../types'
import CellContainer from '../CellContainer'

const useStyles = makeStyles(
  theme => ({
    container: {
      height: '100%',
      width: '100%'
    },
    cellText: {
      color: theme.palette.grey[700],
      letterSpacing: '0.15px',
      ...theme.typography.body2,
      lineHeight: `${theme.spacing(3)}px`,
      '&.primary': {
        color: theme.palette.tertiary.dark
      },
      '&.hovered': {
        color: theme.palette.tertiary.dark
      },
      '&.selected': {
        color: theme.palette.primary.main
      },
      '&.rowSelected': {
        color: theme.palette.tertiary.dark
      }
    }
  }),
  { name: 'EditText-cell' }
)

interface Props {
  text?: string
  isPrimary?: boolean
  isRowSelected?: boolean
  onCellSelect?: (e) => void
}

export const EditTextCell = ({
  text = '',
  isPrimary = false,
  isRowSelected = false
}: Props) => {
  const classes = useStyles()

  const renderCellContent = ({
    isHovered = false,
    isSelected = false
  }: CellProps) => (
    <div
      className={cn(classes.cellText, {
        primary: isPrimary,
        hovered: isHovered,
        selected: isSelected,
        rowSelected: isRowSelected
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
      isSelectable
      actionsActivated
      renderCellContent={renderCellContent}
      renderInlineEdit={renderInlineEdit}
    />
  )
}
