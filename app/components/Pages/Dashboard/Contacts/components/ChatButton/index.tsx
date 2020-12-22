import React, { useState, useMemo, useCallback, ReactNode } from 'react'
import { AnyAction } from 'redux'
import { useSelector, useDispatch } from 'react-redux'
import { ThunkDispatch } from 'redux-thunk'
import { IconButton } from '@material-ui/core'
import { makeStyles, Theme } from '@material-ui/core/styles'

import { mdiChatProcessingOutline } from '@mdi/js'

import { SvgIcon } from 'components/SvgIcons/SvgIcon'

import { selectUser } from 'selectors/user'

import { createRoom } from 'actions/chatroom/room'

// Chatroom in Dashboard
import Chatroom from '../../../Chatroom/Util/chatroom'

const useStyles = makeStyles(
  (theme: Theme) => ({
    button: {
      '&[disabled] svg': {
        fill: theme.palette.action.disabled
      }
    }
  }),
  { name: 'ChatButton' }
)

interface Props {
  contact: IContact
  render?: (props: { onClick: () => void; isDisabled: boolean }) => ReactNode
}

function ChatButton({ contact, render }: Props) {
  const dispatch: ThunkDispatch<any, any, AnyAction> = useDispatch()
  const user = useSelector(selectUser)
  const classes = useStyles()
  const { email, phone_number, users } = contact
  const [isCreatingRoom, setIsCreatingRoom] = useState<boolean>(false)
  const isChattable: boolean = !!(email || phone_number || users)

  // User  can chat just with contacts which at least has
  // email or phone or user attribute.

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

  if (render) {
    return <>{render({ onClick, isDisabled: isCreatingRoom })}</>
  }

  return (
    <IconButton
      className={classes.button}
      disabled={!isChattable || isCreatingRoom}
      onClick={onClick}
    >
      <SvgIcon path={mdiChatProcessingOutline} />
    </IconButton>
  )
}

export default ChatButton
