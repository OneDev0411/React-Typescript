import { makeStyles, Theme } from '@material-ui/core'
import cn from 'classnames'

const useStyles = makeStyles(
  (theme: Theme) => ({
    root: {
      color: 'inherit',
      '&.done': {
        color: theme.palette.success.main
      }
    }
  }),
  {
    name: 'Tasks-TitleCell'
  }
)

interface Props {
  title: string
  status: ICRMTaskStatus
}

export function TitleCell({ title, status }: Props) {
  const classes = useStyles()

  return (
    <div className={cn(classes.root, { done: status === 'DONE' })}>{title}</div>
  )
}
