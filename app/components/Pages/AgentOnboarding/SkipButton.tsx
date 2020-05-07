import React from 'react'
import { browserHistory } from 'react-router'
import { Button, Theme, makeStyles } from '@material-ui/core'

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

  const onClick = () => browserHistory.push(to)

  return (
    <Button className={classes.button} onClick={onClick}>
      Skip
    </Button>
  )
}
