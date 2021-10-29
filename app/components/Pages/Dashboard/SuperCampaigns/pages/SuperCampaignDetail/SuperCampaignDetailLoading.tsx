import { makeStyles } from '@material-ui/core'

import LoadingContainer from '@app/views/components/LoadingContainer'

const useStyles = makeStyles(
  theme => ({
    root: { height: theme.spacing(75) },
    loading: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      height: '100%'
    }
  }),
  { name: 'SuperCampaignDetailLoading' }
)

function SuperCampaignDetailLoading() {
  const classes = useStyles()

  return (
    <div className={classes.root}>
      <LoadingContainer className={classes.loading} noPaddings />
    </div>
  )
}

export default SuperCampaignDetailLoading
