import React, { useState } from 'react'
import { AnyAction } from 'redux'
import { useSelector, useDispatch } from 'react-redux'
import { ThunkDispatch } from 'redux-thunk'

import {
  Box,
  IconButton,
  makeStyles,
  createStyles,
  Theme
} from '@material-ui/core'
import { addNotification, Notification } from 'reapop'

import { IAppState } from 'reducers'

import { SingleEmailComposeDrawer } from 'components/EmailCompose'
import { normalizeContactsForEmailCompose } from 'models/email/helpers/normalize-contact'

import EmailOutline from 'components/SvgIcons/EmailOutline/IconEmailOutline'
import Loading from 'components/SvgIcons/BubblesSpinner/IconBubblesSpinner'
import Chat from 'components/SvgIcons/Chat/IconChat'

import ChatButton from '../../../components/ChatButton'

interface Props {
  contact: IContact
}

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    container: {
      display: 'flex'
    },
    item: {
      display: 'inline-flex',
      '&:not(:last-child)': {
        marginRight: theme.spacing(0.5)
      },
      '& svg': {
        width: 'unset',
        height: theme.spacing(2.25)
      },
      '&:hover svg': {
        fill: theme.palette.primary.main
      }
    }
  })
)

export default function CtaAction({ contact }: Props) {
  const dispatch: ThunkDispatch<any, any, AnyAction> = useDispatch()
  const user: IUser = useSelector((state: IAppState) => state.user)
  const [showEmailComposer, setShowEmailComposer] = useState<boolean>(false)
  const notify = (args: Notification) => dispatch(addNotification(args))
  const classes = useStyles()

  const toggleEmailComposer = () => {
    if ((contact.emails || []).length === 0) {
      return notify({
        status: 'error',
        message: 'User has not email!'
      })
    }

    setShowEmailComposer(!showEmailComposer)
  }

  return (
    <>
      {showEmailComposer && (
        <SingleEmailComposeDrawer
          isOpen
          initialValues={{
            from: user,
            to: normalizeContactsForEmailCompose([contact])
          }}
          onClose={toggleEmailComposer}
          onSent={toggleEmailComposer}
        />
      )}
      <Box className={classes.container}>
        <ChatButton
          contact={contact}
          render={({ onClick, isDisabled }) => (
            <IconButton
              size="small"
              className={classes.item}
              disabled={isDisabled}
              onClick={onClick}
            >
              {!isDisabled ? <Chat /> : <Loading />}
            </IconButton>
          )}
        />
        <IconButton
          size="small"
          className={classes.item}
          onClick={toggleEmailComposer}
        >
          <EmailOutline />
        </IconButton>
      </Box>
    </>
  )
}
