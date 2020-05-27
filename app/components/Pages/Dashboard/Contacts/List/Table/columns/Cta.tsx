import React, { useState } from 'react'
import { useSelector } from 'react-redux'

import { Tooltip, IconButton, makeStyles, Theme } from '@material-ui/core'

import { mdiCalendarOutline } from '@mdi/js'
import { mdiEmailOutline } from '@mdi/js'
import { mdiChatProcessingOutline } from '@mdi/js'
import Icon from '@mdi/react'

import { IAppState } from 'reducers'
import { EventDrawer } from 'components/EventDrawer'
import { SingleEmailComposeDrawer } from 'components/EmailCompose'
import { normalizeContactsForEmailCompose } from 'models/email/helpers/normalize-contact'

import Loading from 'components/SvgIcons/BubblesSpinner/IconBubblesSpinner'
import MissingEmailModal from 'components/MissingEmailModal'
import { normalizeContact } from 'views/utils/association-normalizers'

import ChatButton from '../../../components/ChatButton'

interface Props {
  contact: IContact
}

const useStyles = makeStyles((theme: Theme) => ({
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
    '&:hover svg': {
      color: theme.palette.primary.main
    }
  }
}))

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
              <Icon path={mdiChatProcessingOutline} size={1} />
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
      <div className={classes.container}>
        <Tooltip title="Create an event">
          <IconButton
            size="small"
            className={classes.item}
            onClick={toggleEventDrawer}
          >
            <Icon path={mdiCalendarOutline} size={1} />
          </IconButton>
        </Tooltip>
        <Tooltip title="Send an email">
          <IconButton
            size="small"
            className={classes.item}
            onClick={toggleEmailComposer}
          >
            <Icon path={mdiEmailOutline} size={1} />
          </IconButton>
        </Tooltip>
        {renderChatButton}
      </div>
    </>
  )
}
