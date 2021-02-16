import React from 'react'

import { Dialog, DialogContent } from '@material-ui/core'

import DealRole from './Form'

export default function DealRoleModal(props) {
  return (
    <Dialog open fullWidth maxWidth="sm">
      <DialogContent>
        <DealRole {...props} />
      </DialogContent>
    </Dialog>
  )
}
