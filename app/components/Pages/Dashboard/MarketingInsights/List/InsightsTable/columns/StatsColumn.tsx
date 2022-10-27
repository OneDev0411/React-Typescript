import { makeStyles, Theme, Tooltip } from '@material-ui/core'

const useStyles = makeStyles((theme: Theme) => ({
  root: {
    cursor: 'help'
  }
}))

interface Props {
  title: string | number
  tooltip: string
}

export function StatsColumn({ title, tooltip }: Props) {
  const classes = useStyles()

  return (
    <Tooltip title={tooltip}>
      <span className={classes.root}>{title}</span>
    </Tooltip>
  )
}
