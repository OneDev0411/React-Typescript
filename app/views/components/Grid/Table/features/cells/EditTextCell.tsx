import { makeStyles } from '@material-ui/core'
import cn from 'classnames'

import { CellProps } from '../../types'

import CellContainer from './CellContainer'

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
      }
    }
  }),
  { name: 'EditText-cell' }
)

interface Props {
  text?: string
  isPrimary?: boolean
  onSave?: (e: any) => void
}

const EditTextCell = ({ text = '', isPrimary = false }: Props) => {
  const classes = useStyles()

  const renderCellContent = ({
    isHovered = false,
    isSelected = false
  }: CellProps) => (
    <div
      className={cn(classes.cellText, {
        primary: isPrimary,
        hovered: isHovered,
        selected: isSelected
      })}
    >
      {text}
    </div>
  )

  return <CellContainer renderCellContent={renderCellContent} />
}

export default EditTextCell
