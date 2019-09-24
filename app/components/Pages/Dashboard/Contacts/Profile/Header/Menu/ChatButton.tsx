import React, { useState, useEffect, useMemo, useCallback } from 'react'
import { AnyAction } from 'redux'
import { connect } from 'react-redux'
import { ThunkDispatch } from 'redux-thunk'
import { Button } from '@material-ui/core'
import { makeStyles } from '@material-ui/core/styles'

import { IAppState } from 'reducers'

import { createRoom } from 'actions/chatroom/room'

import ChatIcon from 'components/SvgIcons/Chat/IconChat'

// Chatroom in Dashboard
import Chatroom from '../../../../Chatroom/Util/chatroom'

import { useIconStyles } from '../../../../../../../styles/use-icon-styles'

import { styles } from './styles'

const useStyles = makeStyles(styles, { name: 'ChatButton' })

interface Props {
  contact: IContact
  dispatch: ThunkDispatch<any, any, AnyAction>
  user: IUser
}

function ChatButton({ contact, dispatch, user }: Props) {
  const classes = useStyles()
  const iconClasses = useIconStyles()
  const { email, phone_number, users } = contact
  const [isChattable, setIsChattable] = useState(false)
  const [isCreatingRoom, setIsCreatingRoom] = useState(false)

  // User  can chat just with contacts which at least has
  // email or phone or user attribute.
  useEffect(() => {
    if (isChattable || email || phone_number || users) {
      setIsChattable(true)
    }
  }, [email, isChattable, phone_number, users])

  const recipients = useMemo(() => {
    const filterNull = arr => arr.filter(item => item != null)

    const emails = [user.email, email]

    const phoneNumbers = [user.phone_number, phone_number]

    const allUsers = [user.id, ...(users || []).map(user => user.id)]

    return {
      emails: filterNull(emails),
      phone_numbers: filterNull(phoneNumbers),
      users: filterNull(allUsers)
    }
  }, [email, phone_number, users, user.email, user.id, user.phone_number])

  const onClick = useCallback(async () => {
    try {
      setIsCreatingRoom(true)

      const room = await dispatch(createRoom(recipients))

      setIsCreatingRoom(false)
      Chatroom.openChat(room)
    } catch (error) {
      console.log(error)
      setIsCreatingRoom(false)
    }
  }, [dispatch, recipients])

  return (
    <Button
      className={classes.button}
      color="secondary"
      disabled={!isChattable || isCreatingRoom}
      onClick={onClick}
      size="small"
      variant="outlined"
    >
      <ChatIcon className={iconClasses.rightMargin} />
      Chat
    </Button>
  )
}

export default connect(({ user }: IAppState) => ({ user }))(ChatButton)
