import React from 'react'

import { Button, ButtonProps } from '@material-ui/core'

import { addNotification as notify } from 'components/notification'
import copy from 'utils/copy-text-to-clipboard'

import store from '../../../stores'

interface CopyButtonProps {
  text?: string
  buttonProps?: ButtonProps
}

function CopyButton({ text, buttonProps = {} }: CopyButtonProps) {
  return (
    <Button
      color="primary"
      {...buttonProps}
      onClick={() => {
        copy(text)
        store.dispatch(
          notify({
            message: 'Copied!',
            status: 'success'
          })
        )
      }}
    >
      Copy
    </Button>
  )
}

export default CopyButton
