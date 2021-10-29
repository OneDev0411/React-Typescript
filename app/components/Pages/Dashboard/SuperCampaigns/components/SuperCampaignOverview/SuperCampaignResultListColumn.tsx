import { makeStyles } from '@material-ui/core'

const useStyles = makeStyles(
  theme => ({
    data: {
      color: theme.palette.grey[600],
      ...theme.typography.body3
    }
  }),
  { name: 'SuperCampaignResultListColumn' }
)

interface SuperCampaignResultListColumnProps {
  label?: string
  value: number | string
}

function SuperCampaignResultListColumn({
  label,
  value
}: SuperCampaignResultListColumnProps) {
  const classes = useStyles()

  return <span className={classes.data}>{value}</span>
}

export default SuperCampaignResultListColumn
