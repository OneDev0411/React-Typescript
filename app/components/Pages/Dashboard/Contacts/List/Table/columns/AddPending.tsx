import React from 'react'
import { useDispatch } from 'react-redux'
import { addNotification as notify } from 'reapop'
import { Button } from '@material-ui/core'

import { unparkContact } from 'models/contacts/unparak-contact'

interface Props {
  contactId: UUID
  callback(): void
}

export const AddPending = ({ contactId, callback }: Props) => {
  const dispatch = useDispatch()
  const handleAddPending = async e => {
    try {
      await unparkContact(contactId)
      callback()
      dispatch(
        notify({
          status: 'success',
          message: 'The parked contacts added to your contacts successfuly.'
        })
      )
    } catch (e) {
      console.error(e)
    }
  }

  return (
    <Button variant="outlined" size="small" onClick={handleAddPending}>
      Add to my contacts
    </Button>
  )
}
