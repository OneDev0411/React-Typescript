import React, {
  useState,
  useEffect,
  useMemo,
  useCallback,
  ReactNode
} from 'react'
import { AnyAction } from 'redux'
import { useSelector, useDispatch } from 'react-redux'
import { ThunkDispatch } from 'redux-thunk'
import { Button } from '@material-ui/core'
import { makeStyles, createStyles, Theme } from '@material-ui/core/styles'

import { IAppState } from 'reducers'

import { createRoom } from 'actions/chatroom/room'

import ChatIcon from 'components/SvgIcons/Chat/IconChat'

// Chatroom in Dashboard
import Chatroom from '../../../Chatroom/Util/chatroom'

import { useIconStyles } from '../../../../../../styles/use-icon-styles'

const useStyles = makeStyles(
  (theme: Theme) =>
    createStyles({
      button: {
        marginRight: theme.spacing(2),
        marginBottom: theme.spacing(2),

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
  const user: IUser = useSelector((state: IAppState) => state.user)
  const classes = useStyles()
  const iconClasses = useIconStyles()
  const { email, phone_number, users } = contact
  const [isChattable, setIsChattable] = useState<boolean>(false)
  const [isCreatingRoom, setIsCreatingRoom] = useState<boolean>(false)
  const isDisabled: boolean = !isChattable || isCreatingRoom

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

  if (render) {
    return <>{render({ onClick, isDisabled })}</>
  }

  return (
    <Button
      className={classes.button}
      disabled={isDisabled}
      onClick={onClick}
      size="small"
      variant="outlined"
    >
      <ChatIcon className={iconClasses.rightMargin} />
      Chat
    </Button>
  )
}

export default ChatButton
