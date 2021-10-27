import { Chip, makeStyles } from '@material-ui/core'

const useStyles = makeStyles(
  theme => ({
    root: {
      color: theme.palette.error.main,
      backgroundColor: theme.palette.error.ultralight
    }
  }),
  { name: 'SuperCampaignOptedOutChip' }
)

function SuperCampaignOptedOutChip() {
  const classes = useStyles()

  return <Chip label="Opted-out" size="small" className={classes.root} />
}

export default SuperCampaignOptedOutChip
