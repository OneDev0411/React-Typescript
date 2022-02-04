import { Typography, makeStyles } from '@material-ui/core'

const useStyles = makeStyles(
  theme => ({
    label: { color: theme.palette.grey[500] },
    value: {
      color: theme.palette.grey[900],
      whiteSpace: 'pre-line',
      wordBreak: 'break-word'
    }
  }),
  { name: 'SuperCampaignOverviewDetailLabelValue' }
)

interface SuperCampaignOverviewDetailLabelValueProps {
  className: string
  label: string
  value: string
}

function SuperCampaignOverviewDetailLabelValue({
  className,
  label,
  value
}: SuperCampaignOverviewDetailLabelValueProps) {
  const classes = useStyles()

  return (
    <div className={className}>
      <Typography className={classes.label} variant="caption">
        {label}
      </Typography>
      <Typography className={classes.value} variant="body2">
        {value}
      </Typography>
    </div>
  )
}

export default SuperCampaignOverviewDetailLabelValue
