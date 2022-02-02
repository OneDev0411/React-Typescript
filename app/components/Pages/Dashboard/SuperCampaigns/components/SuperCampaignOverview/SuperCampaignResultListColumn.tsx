import { makeStyles, Typography } from '@material-ui/core'

const useStyles = makeStyles(
  theme => ({
    label: {
      color: theme.palette.grey[500],
      marginRight: theme.spacing(0.5)
    },
    data: {
      color: theme.palette.grey[600],
      ...theme.typography.body3
    }
  }),
  { name: 'SuperCampaignResultListColumn' }
)

interface SuperCampaignResultListColumnProps {
  label?: string
  value: Optional<number | string>
}

function SuperCampaignResultListColumn({
  label,
  value = 0
}: SuperCampaignResultListColumnProps) {
  const classes = useStyles()

  if (label) {
    return (
      <>
        <Typography
          className={classes.label}
          variant="caption"
          component="span"
        >
          {label}
        </Typography>
        <Typography variant="subtitle2" component="span">
          {value}
        </Typography>
      </>
    )
  }

  return <span className={classes.data}>{value}</span>
}

export default SuperCampaignResultListColumn
