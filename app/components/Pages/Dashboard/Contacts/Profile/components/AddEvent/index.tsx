import { useState } from 'react'

import { Button } from '@material-ui/core'
import { connect } from 'react-redux'

import { EventDrawer } from 'components/EventDrawer'
import { normalizeContact } from 'views/utils/association-normalizers'

interface StateProps {
  user: IUser
}

interface Props {
  contact: IContact
  callback?: () => void
}

function AddEvent({ contact, user, callback }: Props & StateProps) {
  const [isDrawerOpen, setIsDrawerOpen] = useState<boolean>(false)

  const toggleDrawer = () => setIsDrawerOpen(!isDrawerOpen)
  const submitCallback = () => {
    if (callback) {
      callback()
    }

    toggleDrawer()
  }

  return (
    <>
      <Button
        variant="contained"
        size="small"
        color="primary"
        onClick={toggleDrawer}
        data-tour-id="add-event-button"
      >
        Add Reminder
      </Button>

      <EventDrawer
        isOpen={isDrawerOpen}
        defaultAssociation={{
          association_type: 'contact',
          contact: normalizeContact(contact)
        }}
        user={user}
        submitCallback={submitCallback}
        onClose={toggleDrawer}
      />
    </>
  )
}

function mapStateToProps({ user }: StateProps) {
  return { user }
}

export default connect(mapStateToProps)(AddEvent)
