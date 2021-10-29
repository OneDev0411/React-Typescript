import { Box } from '@material-ui/core'

import { RoomRecipients } from '../RoomRecipients'

import Agent from './Agent'
import BackOffice from './BackOffice'

export default function CallToAction(props) {
  return (
    <Box width="100%" display="flex" justifyContent="space-between">
      <Box>
        <RoomRecipients room={props.task.room} />
      </Box>

      {props.isBackOffice ? <BackOffice {...props} /> : <Agent {...props} />}
    </Box>
  )
}
