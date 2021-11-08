import React, { useState, useMemo, useCallback, ReactNode } from 'react'

import { Tooltip, IconButton, makeStyles, Theme } from '@material-ui/core'
import { mdiChatProcessingOutline } from '@mdi/js'
import { useSelector, useDispatch } from 'react-redux'
import { AnyAction } from 'redux'
import { ThunkDispatch } from 'redux-thunk'

import { createRoom } from 'actions/chatroom/room'
import { muiIconSizes } from 'components/SvgIcons/icon-sizes'
import { SvgIcon } from 'components/SvgIcons/SvgIcon'
import { selectUser } from 'selectors/user'

// Chatroom in Dashboard
import Chatroom from '../../../Chatroom/Util/chatroom'

const useStyles = makeStyles(
  (theme: Theme) => ({
    button: {
      background: theme.palette.background.paper,
      border: `1px solid ${theme.palette.action.disabledBackground}`,
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
  size?: string
}

function ChatButton({ contact, render, size = muiIconSizes.medium }: Props) {
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
    <Tooltip title="Chat">
      <IconButton
        className={classes.button}
        disabled={!isChattable || isCreatingRoom}
        onClick={onClick}
      >
        <SvgIcon path={mdiChatProcessingOutline} size={size} />
      </IconButton>
    </Tooltip>
  )
}

export default ChatButton
