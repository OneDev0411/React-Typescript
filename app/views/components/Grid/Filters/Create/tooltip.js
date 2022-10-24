import { Tooltip, Typography, makeStyles } from '@material-ui/core'

const useStyles = makeStyles(
  theme => ({
    container: {
      padding: theme.spacing(1, 0),
      textAlign: 'left'
    }
  }),
  {
    name: 'ContactAddFilter'
  }
)

export const FilterItemTooltip = ({ item, children }) => {
  const classes = useStyles()

  return (
    <Tooltip
      placement="right"
      title={
        <div className={classes.container}>
          <Typography variant="subtitle1">{item.label}</Typography>
          <Typography variant="body2">{item.tooltip}</Typography>
        </div>
      }
    >
      {children}
    </Tooltip>
  )
}

export const MissingValueTooltip = ({ enabled, children }) => {
  const classes = useStyles()

  return (
    <Tooltip
      title={
        enabled && (
          <div className={classes.container}>
            <Typography variant="subtitle1">
              You have missed a filter
            </Typography>
            <Typography variant="body2">
              One of your filters is missing a value.
              <br /> Finish editing that before adding a new one.
            </Typography>
          </div>
        )
      }
    >
      {children}
    </Tooltip>
  )
}
