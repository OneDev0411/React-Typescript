import React from 'react'
import { Button, Theme } from '@material-ui/core'
import { makeStyles, createStyles } from '@material-ui/styles'

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    button: {
      width: theme.spacing(27.5)
    }
  })
)

interface Props {
  to: string
  text?: string
}

export default function NextButton({ to, text = 'Next' }: Props) {
  const classes = useStyles()

  return (
    <Button
      href={to}
      size="large"
      color="primary"
      variant="contained"
      className={classes.button}
    >
      {text}
    </Button>
  )
}
