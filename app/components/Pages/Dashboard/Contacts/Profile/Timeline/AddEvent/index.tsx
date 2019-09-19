import React, { useState } from 'react'
import { connect } from 'react-redux'

import { Button } from '@material-ui/core'

import { normalizeContact } from 'views/utils/association-normalizers'
import CalendarIcon from 'components/SvgIcons/Calendar2/IconCalendar'

import { EventDrawer } from 'components/EventDrawer'

interface StateProps {
  user: IUser
}

interface Props {
  contact: IContact
}

function AddEvent({ contact, user }: Props & StateProps) {
  const [isDrawerOpen, setIsDrawerOpen] = useState<boolean>(false)

  const toggleDrawer = () => setIsDrawerOpen(!isDrawerOpen)

  return (
    <>
      <Button color="primary" variant="contained" onClick={toggleDrawer}>
        <CalendarIcon fill="#fff" />
        Add Event
      </Button>

      <EventDrawer
        isOpen={isDrawerOpen}
        defaultAssociation={{
          association_type: 'contact',
          contact: normalizeContact(contact)
        }}
        user={user}
        submitCallback={toggleDrawer}
        onClose={toggleDrawer}
      />
    </>
  )
}

function mapStateToProps({ user }: StateProps) {
  return { user }
}

export default connect(mapStateToProps)(AddEvent)
