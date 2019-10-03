import React from 'react'
import { connect } from 'react-redux'

import Button from '@material-ui/core/Button'

import { IAppState } from 'reducers/index'

import { getActiveTeamId } from 'utils/user-teams'

interface Props {
  event: ICalendarEvent
}

interface StateProps {
  user: IUser
}

function OpenHouseRegistration({ event, user }: Props & StateProps) {
  if (event.event_type === 'Open House') {
    return (
      <Button
        variant="outlined"
        color="secondary"
        size="small"
        href={`/openhouse/${event.crm_task}/${getActiveTeamId(user)}/register`}
        target="_blank"
      >
        Guest Registration Page
      </Button>
    )
  }

  return null
}

function mapStateToProps({ user }: IAppState): StateProps {
  return { user }
}

export default connect(mapStateToProps)(OpenHouseRegistration)
