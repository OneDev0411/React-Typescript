import { useState } from 'react'

import { Tooltip, IconButton, makeStyles, Theme } from '@material-ui/core'
import { mdiCalendarOutline, mdiEmailOutline } from '@mdi/js'
import { useSelector } from 'react-redux'

import { SingleEmailComposeDrawer } from 'components/EmailCompose'
import { EventDrawer } from 'components/EventDrawer'
import MissingEmailModal from 'components/MissingEmailModal'
import { SvgIcon } from 'components/SvgIcons/SvgIcon'
import { normalizeContactsForEmailCompose } from 'models/email/helpers/normalize-contact'
import { selectUser } from 'selectors/user'
import { normalizeContact } from 'views/utils/association-normalizers'

interface Props {
  contact: IContact
}

const useStyles = makeStyles((theme: Theme) => ({
  container: {
    display: 'flex',
    justifyContent: 'start',
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
  const user = useSelector(selectUser)
  const [showEmailComposer, setShowEmailComposer] = useState<boolean>(false)
  const [showEventDrawer, setShowEventDrawer] = useState<boolean>(false)
  const [showMissingEmailModal, setShowMissingEmailModal] =
    useState<boolean>(false)
  const { id, emails } = contact
  const classes = useStyles()

  const toggleEmailComposer = () => {
    if ((emails || []).length === 0) {
      return setShowMissingEmailModal(true)
    }

    setShowEmailComposer(!showEmailComposer)
  }
  const toggleEventDrawer = () => setShowEventDrawer(!showEventDrawer)

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
            <SvgIcon path={mdiCalendarOutline} />
          </IconButton>
        </Tooltip>
        <Tooltip title="Send an email">
          <IconButton
            size="small"
            className={classes.item}
            onClick={toggleEmailComposer}
          >
            <SvgIcon path={mdiEmailOutline} />
          </IconButton>
        </Tooltip>
      </div>
    </>
  )
}
