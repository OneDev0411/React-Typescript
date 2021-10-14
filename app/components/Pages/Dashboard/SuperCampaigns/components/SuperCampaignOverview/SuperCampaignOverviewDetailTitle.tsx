import { Box, Typography, Button, makeStyles } from '@material-ui/core'

const useStyles = makeStyles(
  theme => ({
    title: {
      color: theme.palette.grey[700],
      flex: 1
    },
    action: {
      flex: '0 0',
      minWidth: 'unset'
    }
  }),
  { name: 'SuperCampaignOverviewDetailTitle' }
)

interface SuperCampaignOverviewDetailTitleProps {
  className: string
  title: string
  actionLabel: string
  onActionClick: () => void
}

function SuperCampaignOverviewDetailTitle({
  className,
  title,
  actionLabel,
  onActionClick
}: SuperCampaignOverviewDetailTitleProps) {
  const classes = useStyles()

  return (
    <Box className={className} display="flex" alignItems="center">
      <Typography className={classes.title} variant="body1">
        {title}
      </Typography>
      <Button
        className={classes.action}
        color="primary"
        variant="text"
        size="small"
        onClick={onActionClick}
      >
        {actionLabel}
      </Button>
    </Box>
  )
}

export default SuperCampaignOverviewDetailTitle
