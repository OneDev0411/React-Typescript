import React, { useState } from 'react'
import { connect } from 'react-redux'

import {
  Button,
  Typography,
  makeStyles,
  createStyles,
  Theme
} from '@material-ui/core'

import { IAppState } from 'reducers'

import { CrmEvents } from 'components/Calendar/components/CrmEvents'
import CalendarIcon from 'components/SvgIcons/Calendar2/IconCalendar'

interface StateProps {
  user: IUser
}

interface Props {
  onEventChange: (event: IEvent, type: string) => void
}

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    buttonIcon: {
      width: '16px !important',
      height: '16px !important',
      marginRight: theme.spacing(1)
    }
  })
)

export function CreateEvent(props: Props & StateProps) {
  const [showEventDrawer, setShowEventDrawer] = useState(false)
  const classes = useStyles()

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
        <CalendarIcon fill="#fff" className={classes.buttonIcon} />

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
