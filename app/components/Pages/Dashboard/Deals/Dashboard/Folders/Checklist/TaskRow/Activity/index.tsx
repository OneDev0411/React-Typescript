import { useSelector } from 'react-redux'

import { Button, makeStyles, Theme } from '@material-ui/core'

import { mdiChatOutline } from '@mdi/js'

import { IAppState } from 'reducers'
import { SvgIcon } from 'components/SvgIcons/SvgIcon'
import { muiIconSizes } from 'components/SvgIcons/icon-sizes'

const useStyles = makeStyles(
  (theme: Theme) => ({
    container: {
      height: theme.spacing(4),
      backgroundColor: '#fff',
      lineHeight: 1,
      marginRight: theme.spacing(1),
      border: `1px solid ${theme.palette.divider}`,
      borderRadius: theme.shape.borderRadius,
      '&:hover': {
        backgroundColor: theme.palette.grey['200']
      }
    }
  }),
  {
    name: 'DealsChecklist-Activity'
  }
)

interface Props {
  task: IDealTask
  onClick: (task: IDealTask) => void
}

export function Activity({ task, onClick }: Props) {
  const classes = useStyles()
  const rooms = useSelector<IAppState, any>(({ chatroom }) => chatroom.rooms)

  const room = rooms && rooms[task.room.id] ? rooms[task.room.id] : task.room
  const { new_notifications } = room

  return (
    <Button
      variant="outlined"
      className={classes.container}
      startIcon={<SvgIcon path={mdiChatOutline} size={muiIconSizes.small} />}
      onClick={() => onClick(task)}
    >
      {new_notifications > 0 ? `${new_notifications} New Activity` : 'Activity'}
    </Button>
  )
}
