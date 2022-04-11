import { makeStyles, Typography } from '@material-ui/core'

import { Avatar } from '@app/views/components/Avatar'

const useStyles = makeStyles(
  theme => ({
    root: {
      display: 'flex',
      alignItems: 'center'
    },
    avatar: {
      marginRight: theme.spacing(1),
      width: theme.spacing(3),
      height: theme.spacing(3)
    }
  }),
  { name: 'SocialPostTableColumnOwner' }
)

interface SocialPostTableColumnOwnerProps {
  owner: IUser
}

function SocialPostTableColumnOwner({
  owner
}: SocialPostTableColumnOwnerProps) {
  const classes = useStyles()

  return (
    <div className={classes.root}>
      <Avatar
        className={classes.avatar}
        alt={owner.display_name}
        user={owner}
      />
      <Typography variant="body2">{owner.display_name}</Typography>
    </div>
  )
}

export default SocialPostTableColumnOwner
