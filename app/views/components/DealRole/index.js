import React from 'react'

import { Dialog, DialogTitle, DialogContent } from '@material-ui/core'

import DealRole from './Form'

export default function DealRoleModal(props) {
  return (
    <Dialog open fullWidth maxWidth="md">
      <DialogTitle>Deal Roles</DialogTitle>
      <DialogContent>
        <DealRole {...props} />
      </DialogContent>
    </Dialog>
  )
}
