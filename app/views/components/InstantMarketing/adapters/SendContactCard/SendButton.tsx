import React from 'react'
import { Button } from '@material-ui/core'

interface SendButtonType {
  onClick: () => void
  disabled: boolean
  buttonRenderer: (props: any) => React.ReactNode
  children: React.ReactNode
}

function SendButton(props: SendButtonType) {
  const { children, buttonRenderer, ...restProps } = props

  if (buttonRenderer) {
    return buttonRenderer(restProps)
  }
  return (
    <Button variant="outlined" color="secondary" {...restProps}>
      {props.children}
    </Button>
  )
}

export default SendButton
