import { useState } from 'react'

import { Button } from '@material-ui/core'
import { mdiPlus } from '@mdi/js'
import { connect } from 'react-redux'

import { SvgIcon } from '@app/views/components/SvgIcons/SvgIcon'
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
        color="primary"
        variant="contained"
        onClick={toggleDrawer}
        data-tour-id="add-event-button"
        startIcon={<SvgIcon path={mdiPlus} />}
      >
        Add Event
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
