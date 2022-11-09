import { Avatar, makeStyles, Theme, Tooltip } from '@material-ui/core'
import { AvatarGroup } from '@material-ui/lab'

interface Props {
  assignees?: Nullable<IAssignee[]>
}

const MAX_ASSIGNEES_TO_SHOW = 5

const useStyles = makeStyles(
  (theme: Theme) => ({
    root: {
      display: 'flex',
      alignItems: 'center',
      '& $avatar:not(:first-child)': {
        border: '1px solid #fff'
      }
    },
    avatar: {
      width: '24px',
      height: '24px',
      textTransform: 'capitalize',
      fontSize: theme.typography.caption.fontSize
    }
  }),
  {
    name: 'Contacts-AssigneesCell'
  }
)

interface Props {
  assignees?: Nullable<IAssignee[]>
}

export function AssigneesCell({ assignees }: Props) {
  const classes = useStyles()

  if (!assignees) {
    return null
  }

  return (
    <div className={classes.root}>
      <AvatarGroup
        max={MAX_ASSIGNEES_TO_SHOW}
        spacing={5}
        classes={{
          avatar: classes.avatar
        }}
      >
        {assignees?.map(({ user }) => (
          <Tooltip key={user.id} title={user.display_name}>
            <Avatar
              className={classes.avatar}
              src={user.profile_image_url ?? ''}
            >
              {user.display_name[0]}
            </Avatar>
          </Tooltip>
        ))}
      </AvatarGroup>
    </div>
  )
}
