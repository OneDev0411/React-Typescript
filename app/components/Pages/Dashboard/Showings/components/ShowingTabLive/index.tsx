import React from 'react'

import LiveShowingList from '../LiveShowingList'
import CreateShowingList from '../CreateShowingList'

import ShowingListWithTitle from '../ShowingListWithTitle'

function ShowingTabLive() {
  return (
    <>
      <ShowingListWithTitle title="New Updates" />
      <ShowingListWithTitle title="Today" />
      <LiveShowingList />
      <CreateShowingList />
    </>
  )
}

export default ShowingTabLive
