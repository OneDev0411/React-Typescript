import React, { useState } from 'react'
import { connect } from 'react-redux'
import cn from 'classnames'
import { Button, Typography } from '@material-ui/core'

import { IAppState } from 'reducers'

import { CrmEvents } from 'components/Calendar/components/CrmEvents'
import CalendarIcon from 'components/SvgIcons/Calendar2/IconCalendar'

import { useIconStyles } from '../../../../../../styles/use-icon-styles'

interface StateProps {
  user: IUser
}

interface Props {
  onEventChange: (event: IEvent, type: string) => void
}

export function CreateEvent(props: Props & StateProps) {
  const [showEventDrawer, setShowEventDrawer] = useState(false)
  const iconClasses = useIconStyles()

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
        <CalendarIcon
          fill="#fff"
          className={cn(iconClasses.small, iconClasses.rightMargin)}
        />

        <Typography variant="button" noWrap>
          Add Event
        </Typography>
      </Button>

      <CrmEvents
        isEventDrawerOpen={showEventDrawer}
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
