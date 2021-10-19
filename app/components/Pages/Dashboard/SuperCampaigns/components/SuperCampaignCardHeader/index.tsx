import {
  Box,
  Typography,
  Button,
  makeStyles,
  TypographyProps
} from '@material-ui/core'

const useStyles = makeStyles(
  theme => ({
    title: {
      color: theme.palette.grey[700],
      flex: 1
    },
    action: {
      flex: '0 0',
      minWidth: 'unset',
      whiteSpace: 'nowrap'
    }
  }),
  { name: 'SuperCampaignCardHeader' }
)

export interface SuperCampaignCardHeaderProps {
  className?: string
  title: string
  titleVariant?: TypographyProps['variant']
  actionLabel?: string
  onActionClick?: () => void
}

function SuperCampaignCardHeader({
  className,
  title,
  titleVariant,
  actionLabel,
  onActionClick
}: SuperCampaignCardHeaderProps) {
  const classes = useStyles()

  return (
    <Box className={className} display="flex" alignItems="center">
      <Typography className={classes.title} variant={titleVariant}>
        {title}
      </Typography>
      {actionLabel && (
        <Button
          className={classes.action}
          color="primary"
          variant="text"
          size="small"
          onClick={onActionClick}
        >
          {actionLabel}
        </Button>
      )}
    </Box>
  )
}

export default SuperCampaignCardHeader
