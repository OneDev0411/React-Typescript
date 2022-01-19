import { makeStyles } from '@material-ui/core'

import CellContainer from './CellContainer'

const useStyles = makeStyles(
  theme => ({
    container: {
      height: '100%',
      width: '100%'
    },
    cellText: ({ isPrimary }: Props) => ({
      color: isPrimary
        ? theme.palette.tertiary.dark
        : `${theme.palette.grey[700]}`,
      letterSpacing: '0.15px',
      ...theme.typography.body2,
      lineHeight: `${theme.spacing(3)}px`
    })
  }),
  { name: 'EditText-cell' }
)

interface Props {
  text?: string
  isPrimary?: boolean
  onSave?: (e: any) => void
  renderCellContent?: () => React.ReactElement
}

const EditTextCell = ({ text = '', isPrimary = false, onSave }: Props) => {
  const classes = useStyles({ isPrimary })

  return (
    <CellContainer
      renderCellContent={() => <div className={classes.cellText}>{text}</div>}
    />
  )
}

export default EditTextCell
