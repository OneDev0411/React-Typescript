import { Box, makeStyles, Tooltip, Avatar, Theme } from '@material-ui/core'
import cn from 'classnames'
import pluralize from 'pluralize'

const useStyles = makeStyles(
  (theme: Theme) => ({
    avatarsContainer: {
      '& $avatar:not(:first-child)': {
        marginLeft: '-10px'
      }
    },
    avatar: {
      width: '28px',
      height: '28px'
    },
    more: {
      ...theme.typography.caption,
      backgroundColor: theme.palette.grey['200']
    }
  }),
  {
    name: 'RoomRecipients'
  }
)

interface Props {
  room: IDealTaskRoom
}

export function RoomRecipients({ room }: Props) {
  const classes = useStyles()

  const recipientsCount = room.users.length
  const users = room.users.slice(0, 2)
  const moreCount = recipientsCount - users.length

  return (
    <Tooltip
      title={
        <div>
          <p>
            <strong>{pluralize('Participant', recipientsCount, true)}</strong>
          </p>
          {room.users.map(user => (
            <div key={user.id}>{user.display_name}</div>
          ))}
        </div>
      }
    >
      <Box
        display="flex"
        alignItems="center"
        height="100%"
        className={classes.avatarsContainer}
      >
        {users.map(user => (
          <Avatar
            key={user.id}
            className={classes.avatar}
            src={user.profile_image_url!}
          />
        ))}

        {moreCount > 0 && (
          <Avatar className={cn(classes.avatar, classes.more)}>
            +{moreCount}
          </Avatar>
        )}
      </Box>
    </Tooltip>
  )
}
