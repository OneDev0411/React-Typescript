import { Avatar, makeStyles, Theme } from '@material-ui/core'
import { AvatarGroup } from '@material-ui/lab'

const useStyles = makeStyles(
  (theme: Theme) => ({
    root: {
      display: 'flex',
      alignItems: 'center',
      '& $avatar:not(:first-child)': {
        marginLeft: theme.spacing(-0.5),
        border: '1px solid #fff'
      }
    },
    avatar: {
      width: `${theme.spacing(3)}px !important`,
      height: theme.spacing(3),
      fontSize: theme.typography.caption.fontSize
    }
  }),
  {
    name: 'Tasks-AssigneeCell'
  }
)

interface Props {
  assignees: Nullable<IUser[]>
}

export function AssigneeCell({ assignees }: Props) {
  const classes = useStyles()

  return (
    <div className={classes.root}>
      <AvatarGroup
        max={5}
        spacing={5}
        classes={{
          avatar: classes.avatar
        }}
      >
        {assignees?.map(assignee => (
          <Avatar
            key={assignee.id}
            className={classes.avatar}
            src={assignee.profile_image_url ?? ''}
          >
            {assignee.display_name[0]}
          </Avatar>
        ))}
      </AvatarGroup>
    </div>
  )
}
