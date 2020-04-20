import React, { useState } from 'react'
import { useSelector } from 'react-redux'

import {
  Box,
  Tooltip,
  IconButton,
  makeStyles,
  createStyles,
  Theme
} from '@material-ui/core'

import { IAppState } from 'reducers'
import { EventDrawer } from 'components/EventDrawer'
import { SingleEmailComposeDrawer } from 'components/EmailCompose'
import { normalizeContactsForEmailCompose } from 'models/email/helpers/normalize-contact'

import EmailOutline from 'components/SvgIcons/EmailOutline/IconEmailOutline'
import CalendarIcon from 'components/SvgIcons/Calendar2/IconCalendar'
import Loading from 'components/SvgIcons/BubblesSpinner/IconBubblesSpinner'
import Chat from 'components/SvgIcons/Chat/IconChat'
import MissingEmailModal from 'components/MissingEmailModal'
import { normalizeContact } from 'views/utils/association-normalizers'

import ChatButton from '../../../components/ChatButton'

interface Props {
  contact: IContact
}

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    container: {
      display: 'flex',
      justifyContent: 'end',
      alignItems: 'center'
    },
    item: {
      display: 'inline-flex',
      '&:not(:last-child)': {
        marginRight: theme.spacing(0.75)
      },
      '& svg': {
        width: 'unset',
        height: theme.spacing(3),
        '&[data-icon="chat"]': { height: theme.spacing(2.5) },
        '&[data-icon="event"]': { height: theme.spacing(2.25) }
      },
      '&:hover svg': {
        fill: theme.palette.primary.main
      }
    },
    emailIcon: {
      height: theme.spacing(2.5)
    }
  })
)

export default function CtaAction({ contact }: Props) {
  const user: IUser = useSelector((state: IAppState) => state.user)
  const [showEmailComposer, setShowEmailComposer] = useState<boolean>(false)
  const [showEventDrawer, setShowEventDrawer] = useState<boolean>(false)
  const [showMissingEmailModal, setShowMissingEmailModal] = useState<boolean>(
    false
  )
  const { id, emails, email, phone_number, users } = contact
  const classes = useStyles()

  const toggleEmailComposer = () => {
    if ((emails || []).length === 0) {
      return setShowMissingEmailModal(true)
    }

    setShowEmailComposer(!showEmailComposer)
  }
  const toggleEventDrawer = () => setShowEventDrawer(!showEventDrawer)

  const renderChatButton = (email || phone_number || users) && (
    <ChatButton
      contact={contact}
      render={({ onClick, isDisabled }) => (
        <Tooltip title="Chat with contact">
          <IconButton
            size="small"
            className={classes.item}
            disabled={isDisabled}
            onClick={onClick}
          >
            {!isDisabled ? (
              // @ts-ignore js component
              <Chat data-icon="chat" />
            ) : (
              <Loading data-icon="loading" />
            )}
          </IconButton>
        </Tooltip>
      )}
    />
  )

  return (
    <>
      {showMissingEmailModal && (
        <MissingEmailModal
          isOpen
          contactId={id}
          onClose={() => setShowMissingEmailModal(false)}
          action="send an Email"
        />
      )}
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
      {showEventDrawer && (
        <EventDrawer
          isOpen
          user={user}
          defaultAssociation={{
            association_type: 'contact',
            contact: normalizeContact(contact)
          }}
          onClose={toggleEventDrawer}
          submitCallback={toggleEventDrawer}
        />
      )}
      <Box className={classes.container}>
        <Tooltip title="Create an event">
          <IconButton
            size="small"
            className={classes.item}
            onClick={toggleEventDrawer}
          >
            <CalendarIcon data-icon="event" />
          </IconButton>
        </Tooltip>
        <Tooltip title="Send an email">
          <IconButton
            size="small"
            className={classes.item}
            onClick={toggleEmailComposer}
          >
            <EmailOutline data-icon="email" />
          </IconButton>
        </Tooltip>
        {renderChatButton}
      </Box>
    </>
  )
}
