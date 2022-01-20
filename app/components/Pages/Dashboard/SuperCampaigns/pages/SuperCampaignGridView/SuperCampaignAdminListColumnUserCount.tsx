import { makeStyles, Typography } from '@material-ui/core'
import pluralize from 'pluralize'

const useStyles = makeStyles(
  theme => ({
    root: { color: theme.palette.grey[500] }
  }),
  { name: 'SuperCampaignAdminListColumnUserCount' }
)

interface SuperCampaignAdminListColumnUserCountProps {
  value: number
}

function SuperCampaignAdminListColumnUserCount({
  value
}: SuperCampaignAdminListColumnUserCountProps) {
  const classes = useStyles()

  return (
    <Typography className={classes.root} variant="body2" noWrap>
      On behalf of {pluralize('user', value, true)}
    </Typography>
  )
}

export default SuperCampaignAdminListColumnUserCount
