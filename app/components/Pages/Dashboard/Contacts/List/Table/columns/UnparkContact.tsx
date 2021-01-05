import React, { useState } from 'react'
import { useDispatch } from 'react-redux'

import { Button, Tooltip, makeStyles, Theme } from '@material-ui/core'

import { addNotification as notify } from 'components/notification'

import { unparkContact } from 'models/contacts/unparak-contact'

interface Props {
  contactId: UUID
  callback(): void
}

export const useStyles = makeStyles(
  (theme: Theme) => ({
    unpark: {
      whiteSpace: 'nowrap'
    }
  }),
  { name: 'UnparkContact' }
)

export const UnparkContact = ({ contactId, callback }: Props) => {
  const classes = useStyles()
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
    <Tooltip title="It's a parked contact, add to the contacts by clicking on this">
      <Button
        variant="outlined"
        size="small"
        onClick={handleUnparking}
        disabled={isUnParking}
        className={classes.unpark}
      >
        {isUnParking ? 'Adding' : 'Add to my contacts'}
      </Button>
    </Tooltip>
  )
}
