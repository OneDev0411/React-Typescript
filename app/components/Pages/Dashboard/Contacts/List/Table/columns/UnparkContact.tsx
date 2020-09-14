import React, { useState } from 'react'
import { useDispatch } from 'react-redux'
import { addNotification as notify } from 'reapop'
import { Button } from '@material-ui/core'

import { unparkContact } from 'models/contacts/unparak-contact'

interface Props {
  contactId: UUID
  callback(): void
}

export const UnparkContact = ({ contactId, callback }: Props) => {
  const [isUnParking, setIsUnParking] = useState(false)
  const dispatch = useDispatch()

  const handleUnparking = async e => {
    setIsUnParking(true)

    try {
      await unparkContact([contactId])
      callback()
      dispatch(
        notify({
          status: 'success',
          message: 'The parked contacts added to your contacts successfuly.'
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
      onClick={handleUnparking}
      disabled={isUnParking}
    >
      {isUnParking ? 'Adding' : 'Add to my contacts'}
    </Button>
  )
}
