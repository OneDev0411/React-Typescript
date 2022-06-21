import { Avatar, makeStyles, Theme } from '@material-ui/core'

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
      height: theme.spacing(3)
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
      {assignees?.map(assignee => (
        <Avatar
          key={assignee.id}
          className={classes.avatar}
          src={assignee.profile_image_url ?? ''}
        >
          {assignee.display_name[0]}
        </Avatar>
      ))}
    </div>
  )
}
