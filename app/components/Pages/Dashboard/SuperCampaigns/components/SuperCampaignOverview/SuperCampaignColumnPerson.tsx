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
  isOptedOut?: boolean
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
      <Typography className={classes.name} variant="body2" noWrap>
        {user.display_name}{' '}
        <span className={classes.brand}>({brand.name})</span>
      </Typography>
    </div>
  )
}

export default SuperCampaignEnrollmentListColumnPerson
