import { Box, makeStyles, Theme } from '@material-ui/core'
import { useSelector } from 'react-redux'

import { IAppState } from 'reducers'

const useStyles = makeStyles(
  (theme: Theme) => ({
    badge: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      width: theme.spacing(3),
      height: theme.spacing(3),
      borderRadius: '100%',
      background: theme.palette.error.main,
      color: '#fff',
      ...theme.typography.caption
    }
  }),
  {
    name: 'DealsChecklist-Notification'
  }
)

interface Props {
  task: IDealTask
}

export function TaskNotifications({ task }: Props) {
  const classes = useStyles()
  const rooms = useSelector<IAppState, any>(({ chatroom }) => chatroom.rooms)

  const room = rooms && rooms[task.room.id] ? rooms[task.room.id] : task.room
  const { new_notifications } = room

  if (!new_notifications) {
    return null
  }

  return (
    <Box ml={1}>
      <span className={classes.badge}>{new_notifications}</span>
    </Box>
  )
}
