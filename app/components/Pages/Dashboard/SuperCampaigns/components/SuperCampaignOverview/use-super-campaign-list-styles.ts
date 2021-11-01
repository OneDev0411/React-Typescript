import { makeStyles } from '@material-ui/core'

export const useSuperCampaignListStyles = makeStyles(
  theme => ({
    row: {
      borderBottom: `1px solid ${theme.palette.grey[100]}`,
      paddingRight: theme.spacing(0.5)
    },
    rowBorderTop: {
      '&:first-of-type': { borderTop: `1px solid ${theme.palette.grey[100]}` }
    }
  }),
  { name: 'useSuperCampaignListStyles' }
)
