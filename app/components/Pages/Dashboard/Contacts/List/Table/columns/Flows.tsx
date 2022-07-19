import { makeStyles, Theme } from '@material-ui/core'

const useStyles = makeStyles(
  (theme: Theme) => ({
    count: theme.typography.body2,
    noFlows: {
      color: theme.palette.grey[700],
      ...theme.typography.caption
    }
  }),
  { name: 'FlowsCell' }
)

interface Props {
  count: number
}

export function FlowsCell({ count }: Props) {
  const classes = useStyles()

  if (count === 0) {
    return <span className={classes.noFlows}>No Flows</span>
  }

  return <span className={classes.count}>in {count} flows</span>
}
