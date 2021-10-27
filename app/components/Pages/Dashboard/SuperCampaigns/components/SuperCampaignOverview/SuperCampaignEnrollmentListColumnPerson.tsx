import { makeStyles, Typography } from '@material-ui/core'
import classNames from 'classnames'

import { Avatar } from '@app/views/components/Avatar'

const useStyles = makeStyles(
  theme => ({
    root: {
      display: 'flex',
      alignItems: 'center'
    },
    name: { marginLeft: theme.spacing(1) },
    brand: { color: theme.palette.grey[400] },
    optedOut: { opacity: 0.2 }
  }),
  { name: 'SuperCampaignEnrollmentListColumnPerson' }
)

interface SuperCampaignEnrollmentListColumnPersonProps {
  isOptedOut: boolean
  user: IUser
  brand: IBrand
}

function SuperCampaignEnrollmentListColumnPerson({
  isOptedOut,
  user,
  brand
}: SuperCampaignEnrollmentListColumnPersonProps) {
  const classes = useStyles()

  return (
    <div className={classNames(classes.root, isOptedOut && classes.optedOut)}>
      <Avatar size="small" user={user} />
      <Typography variant="body2" className={classes.name}>
        {user.display_name}{' '}
        <span className={classes.brand}>({brand.name}`s Team)</span>
      </Typography>
    </div>
  )
}

export default SuperCampaignEnrollmentListColumnPerson
