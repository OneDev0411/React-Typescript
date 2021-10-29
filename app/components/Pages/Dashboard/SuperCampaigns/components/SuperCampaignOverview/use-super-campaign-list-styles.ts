import { makeStyles } from '@material-ui/core'

export const useSuperCampaignListStyles = makeStyles(
  theme => ({
    row: {
      borderTop: `1px solid ${theme.palette.grey[100]}`,
      paddingRight: theme.spacing(0.5)
    }
  }),
  { name: 'use-super-campaign-list-styles' }
)
