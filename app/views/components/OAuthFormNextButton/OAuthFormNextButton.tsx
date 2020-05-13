import React, { ReactNode } from 'react'
import { browserHistory } from 'react-router'
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
  children?: ReactNode
  disabled?: boolean
  to?: string
  text?: string
  type?: 'button' | 'submit'
  onClick?: () => void
}

export function OAuthFormNextButton({
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
