import { Typography, makeStyles } from '@material-ui/core'
import { useSelector } from 'react-redux'

import { selectUserDisplayName, selectUserEmail } from '@app/selectors/user'

const useStyles = makeStyles(
  theme => ({
    from: {
      color: theme.palette.grey[600],
      marginRight: theme.spacing(1)
    }
  }),
  { name: 'SuperCampaignPreviewDrawerFrom' }
)

function SuperCampaignPreviewDrawerFrom() {
  const classes = useStyles()

  const userDisplayName = useSelector(selectUserDisplayName)
  const userEmail = useSelector(selectUserEmail)

  return (
    <Typography variant="body2">
      <span className={classes.from}>From</span>
      {userDisplayName} &lt;{userEmail}&gt;
    </Typography>
  )
}

export default SuperCampaignPreviewDrawerFrom
