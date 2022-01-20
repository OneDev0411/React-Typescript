import { makeStyles, alpha } from '@material-ui/core'

//----

interface Props {
  text?: string
  renderCellContent: () => React.ReactNode
}

//----

const useStyles = makeStyles(
  theme => ({
    container: {
      display: 'flex',
      alignItems: 'center',
      height: '100%',
      width: '100%',
      overflow: 'hidden',
      textOverflow: 'ellipsis',
      borderRight: `1px solid ${alpha(theme.palette.divider, 0.06)}`,
      whiteSpace: 'nowrap'
    },
    inlineViewContainer: {
      display: 'flex',
      position: 'relative',
      overflow: 'hidden',
      gap: theme.spacing(1),
      height: theme.spacing(3),
      paddingLeft: theme.spacing(2)
    }
  }),
  { name: 'CellContainer' }
)

//----

const CellContainer = ({ renderCellContent }: Props) => {
  const classes = useStyles({ isHovered: false })

  const cellContent = renderCellContent()
  const renderInlineContent = () => {
    return <div className={classes.inlineViewContainer}>{cellContent}</div>
  }

  return <div className={classes.container}>{renderInlineContent()}</div>
}

export default CellContainer
