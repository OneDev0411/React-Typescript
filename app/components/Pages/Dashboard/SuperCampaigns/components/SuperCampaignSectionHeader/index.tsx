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
      minWidth: 'unset'
    }
  }),
  { name: 'SuperCampaignSectionHeader' }
)

export interface SuperCampaignSectionHeaderProps {
  className?: string
  title: string
  titleVariant?: TypographyProps['variant']
  actionLabel: string
  onActionClick: () => void
}

function SuperCampaignSectionHeader({
  className,
  title,
  titleVariant,
  actionLabel,
  onActionClick
}: SuperCampaignSectionHeaderProps) {
  const classes = useStyles()

  return (
    <Box className={className} display="flex" alignItems="center">
      <Typography className={classes.title} variant={titleVariant}>
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

export default SuperCampaignSectionHeader
