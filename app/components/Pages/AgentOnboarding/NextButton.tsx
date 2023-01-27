import { ReactNode } from 'react'

import { Button, Theme } from '@material-ui/core'
import { makeStyles } from '@material-ui/styles'

import { useNavigate } from '@app/hooks/use-navigate'

const useStyles = makeStyles((theme: Theme) => ({
  button: {
    width: theme.spacing(27.5)
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
  const navigate = useNavigate()
  const onClickHandler = () => {
    if (to) {
      navigate(to)
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
