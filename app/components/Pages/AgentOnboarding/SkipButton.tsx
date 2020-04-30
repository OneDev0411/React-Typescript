import React from 'react'
import { browserHistory } from 'react-router'
import { Button, Theme } from '@material-ui/core'
import { makeStyles } from '@material-ui/styles'

import { FOOTER_BUTTONS_WIDTH } from './constants'

const useStyles = makeStyles((theme: Theme) => ({
  button: {
    width: theme.spacing(FOOTER_BUTTONS_WIDTH),
    marginRight: theme.spacing(3)
  }
}))

interface Props {
  to: string
}

export default function SkipButton({ to }: Props) {
  const classes = useStyles()

  return (
    <Button
      size="large"
      variant="outlined"
      className={classes.button}
      onClick={() => browserHistory.push(to)}
    >
      Skip
    </Button>
  )
}
