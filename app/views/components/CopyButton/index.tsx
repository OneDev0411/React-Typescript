import React from 'react'
import Button from '@material-ui/core/Button'

import { addNotification as notify } from 'components/notification'

import copy from 'utils/copy-text-to-clipboard'

import store from '../../../stores'

interface CopyButtonProps {
  text?: string
  buttonProps: any
}

function CopyButton(props: CopyButtonProps) {
  return (
    <Button
      color="primary"
      {...props.buttonProps}
      onClick={() => {
        copy(props.text)
        store.dispatch(
          notify({
            message: 'Copied!',
            status: 'success'
          }) as any
        )
      }}
    >
      Copy
    </Button>
  )
}

CopyButton.defaultProps = {
  buttonProps: {}
}

export default CopyButton
