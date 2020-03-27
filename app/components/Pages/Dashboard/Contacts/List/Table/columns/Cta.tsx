import React, { useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'

import { Box, makeStyles, createStyles, Theme } from '@material-ui/core'

import { IAppState } from 'reducers'

import { SingleEmailComposeDrawer } from 'components/EmailCompose'
import { normalizeContactsForEmailCompose } from 'models/email/helpers/normalize-contact'

import EmailOutline from 'components/SvgIcons/EmailOutline/IconEmailOutline'
import Chat from 'components/SvgIcons/Chat/IconChat'

import { toggleChatbar } from '../../../../../../../store_actions/chatroom'

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
        height: theme.spacing(2.25)
      },
      '&:hover svg': {
        fill: theme.palette.primary.main
      }
    }
  })
)

export default function CtaAction({ contact }: Props) {
  const dispatch = useDispatch()
  const user = useSelector((state: IAppState) => state.user as IUser)
  const [showEmailComposer, setShowEmailComposer] = useState<boolean>(false)
  const classes = useStyles()

  const toggleEmailComposer = () => setShowEmailComposer(!showEmailComposer)
  const toggleChat = () => dispatch(toggleChatbar())

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
        <Box className={classes.item} onClick={toggleChat}>
          <Chat />
        </Box>
        <Box className={classes.item} onClick={toggleEmailComposer}>
          <EmailOutline />
        </Box>
      </Box>
    </>
  )
}
