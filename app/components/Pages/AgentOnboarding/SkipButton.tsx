import { Button, Theme, makeStyles } from '@material-ui/core'

import { useNavigate } from '@app/hooks/use-navigate'

const useStyles = makeStyles(
  (theme: Theme) => ({
    button: {
      position: 'absolute',
      top: theme.spacing(1),
      right: theme.spacing(1.5)
    }
  }),
  { name: 'SkipButton' }
)

interface Props {
  to: string
}

export default function SkipButton({ to }: Props) {
  const classes = useStyles()
  const navigate = useNavigate()
  const onClick = () => navigate(to)

  return (
    <Button className={classes.button} onClick={onClick}>
      Skip
    </Button>
  )
}
