import React, { ReactNode } from 'react'
import { browserHistory } from 'react-router'
import { Button, Theme } from '@material-ui/core'
import { makeStyles } from '@material-ui/styles'

import { FOOTER_BUTTONS_WIDTH } from './constants'

const useStyles = makeStyles((theme: Theme) => ({
  button: {
    width: theme.spacing(FOOTER_BUTTONS_WIDTH)
  }
}))

interface Props {
  children?: ReactNode
  disabled?: boolean
  to?: string
  text?: string
  type?: 'button' | 'submit'
  onClick?: () => void
}

export default function NextButton({
  children = 'Next',
  disabled,
  onClick,
  to,
  type = 'button'
}: Props) {
  const classes = useStyles()

  const onClickHandler = () => {
    if (to) {
      browserHistory.push(to)
    } else if (onClick) {
      onClick()
    }
  }

  return (
    <Button
      className={classes.button}
      disabled={disabled}
      color="primary"
      onClick={onClickHandler}
      size="large"
      type={type}
      variant="contained"
    >
      {children}
    </Button>
  )
}
