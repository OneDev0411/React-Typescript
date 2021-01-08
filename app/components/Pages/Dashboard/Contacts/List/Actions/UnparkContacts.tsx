import React, { useState } from 'react'
import { useDispatch } from 'react-redux'

import { Button } from '@material-ui/core'

import { addNotification as notify } from 'components/notification'

import { unparkContact } from 'models/contacts/unparak-contact'

interface Props {
  contacts: UUID[]
  disabled: boolean
  callback(): void
}

export const UnparkContacts = ({
  contacts,
  callback,
  disabled = false
}: Props) => {
  const [isUnParking, setIsUnParking] = useState(false)
  const dispatch = useDispatch()

  const handleAddPending = async e => {
    if (contacts.length === 0) {
      return
    }

    setIsUnParking(true)

    try {
      await unparkContact(contacts)
      callback()
      dispatch(
        notify({
          status: 'success',
          message: `${contacts.length} parked contacts added to your contacts successfuly.`
        })
      )
    } catch (e) {
      console.error(e)
    } finally {
      setIsUnParking(false)
    }
  }

  return (
    <Button
      variant="outlined"
      size="small"
      onClick={handleAddPending}
      disabled={disabled || isUnParking}
    >
      {isUnParking ? 'Adding' : 'Add Contacts'}
    </Button>
  )
}
