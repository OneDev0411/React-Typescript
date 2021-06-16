import React from 'react'

import { Dialog, DialogContent } from '@material-ui/core'

import DealRole from './Form'

export default function DealRoleModal(props) {
  return (
    <Dialog
      open={props.isOpen}
      fullWidth
      maxWidth="sm"
      className="deal-role-form-modal"
    >
      <DialogContent>
        <DealRole {...props} />
      </DialogContent>
    </Dialog>
  )
}
