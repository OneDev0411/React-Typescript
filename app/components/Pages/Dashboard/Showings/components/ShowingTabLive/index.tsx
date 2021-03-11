import React from 'react'

import LiveShowingList from '../LiveShowingList'
import CreateShowingList from '../CreateShowingList'

import AppointmentListWithTitle from '../AppointmentListWithTitle'

function ShowingTabLive() {
  return (
    <>
      <AppointmentListWithTitle title="New Updates" />
      <AppointmentListWithTitle title="Today" />
      <LiveShowingList />
      <CreateShowingList />
    </>
  )
}

export default ShowingTabLive
