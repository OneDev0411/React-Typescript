import { makeStyles } from '@material-ui/core'

export default makeStyles(
  theme => ({
    root: { minHeight: theme.spacing(23) } // This is the min card height according to the designs
  }),
  { name: 'useSuperCampaignWithEnrollmentCardStyles' }
)
