import * as React from 'react'

import { Button } from '@material-ui/core'

import Drawer from '../OverlayDrawer'
import EditEmailSignature from '../EditEmailSignature'

interface Props {
  isOpen: boolean
  onClose: () => void
}

export function EditEmailSignatureDrawer({ isOpen, onClose }: Props) {
  return (
    <Drawer open={isOpen} onClose={onClose}>
      <Drawer.Header title="Edit Email Signature" />
      <Drawer.Body style={{ overflow: 'hidden' }}>
        <EditEmailSignature onSaved={onClose} showActions={false} />
      </Drawer.Body>
      <Drawer.Footer>
        <Button
          variant="contained"
          color="primary"
          form="email-signature-form"
          type="submit"
        >
          Save
        </Button>
      </Drawer.Footer>
    </Drawer>
  )
}
