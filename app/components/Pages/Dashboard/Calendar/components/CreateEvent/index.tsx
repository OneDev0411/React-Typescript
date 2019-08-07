import React, { useState } from 'react'
import { connect } from 'react-redux'

import { Button } from '@material-ui/core'

import { IAppState } from 'reducers'

import { CrmEvents } from 'components/Calendar/components/CrmEvents'

interface StateProps {
  user: IUser
}

interface Props {
  user?: IUser
  activeDate: Date | null
  onEventChange: (event: IEvent, type: string) => void
}

export function CreateEvent(props: Props) {
  const [showEventDrawer, setShowEventDrawer] = useState(false)

  const handleEventChange = (event: IEvent, type: string) => {
    setShowEventDrawer(false)
    props.onEventChange(event, type)
  }

  return (
    <div>
      <Button
        color="primary"
        variant="contained"
        size="medium"
        onClick={() => setShowEventDrawer(true)}
      >
        Create Event
      </Button>

      <CrmEvents
        isEventDrawerOpen={showEventDrawer}
        selectedDate={props.activeDate}
        user={props.user as IUser}
        onEventChange={handleEventChange}
        onCloseEventDrawer={() => setShowEventDrawer(false)}
      />
    </div>
  )
}

function mapStateToProps(state: IAppState) {
  return {
    user: state.user
  }
}

export default connect<StateProps, {}, Props>(mapStateToProps)(CreateEvent)
