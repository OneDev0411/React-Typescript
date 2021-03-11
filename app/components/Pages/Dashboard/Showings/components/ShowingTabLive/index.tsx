import React from 'react'

import LiveShowingList from '../LiveShowingList'
import CreateShowingList from '../CreateShowingList'

import AppointmentList from '../AppointmentList'
import BoxWithTitle from '../BoxWithTitle'

function ShowingTabLive() {
  return (
    <>
      <BoxWithTitle title="New Updates">
        <AppointmentList />
      </BoxWithTitle>
      <BoxWithTitle title="Today">
        <AppointmentList />
      </BoxWithTitle>
      <BoxWithTitle title="Live Showings">
        <LiveShowingList />
      </BoxWithTitle>
      <BoxWithTitle title="Create A New Showing">
        <CreateShowingList />
      </BoxWithTitle>
    </>
  )
}

export default ShowingTabLive
