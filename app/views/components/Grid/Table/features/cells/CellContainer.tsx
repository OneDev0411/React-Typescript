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
      height: '100%',
      width: '100%',
      overflow: 'hidden',
      textOverflow: 'ellipsis',
      borderRight: `1px solid ${alpha(theme.palette.divider, 0.06)}`
    },
    inlineViewContainer: {
      position: 'relative',
      padding: theme.spacing(1, 0, 1, 2),
      overflow: 'hidden',
      height: '100%',
      '& > div': {
        height: '25px',
        display: 'inline-block',
        overflow: 'hidden'
      }
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
