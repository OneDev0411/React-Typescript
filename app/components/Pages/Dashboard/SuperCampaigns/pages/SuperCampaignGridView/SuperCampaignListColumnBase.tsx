import { ReactNode } from 'react'

import { Typography, makeStyles } from '@material-ui/core'

const useStyles = makeStyles(
  theme => ({
    root: {
      whiteSpace: 'nowrap',
      overflow: 'hidden',
      textOverflow: 'ellipsis'
    },
    label: {
      color: theme.palette.grey[500],
      marginRight: theme.spacing(0.5)
    }
  }),
  { name: 'SuperCampaignListColumnBase' }
)

interface SuperCampaignListColumnBaseProps {
  label: string
  children: ReactNode
}

function SuperCampaignListColumnBase({
  label,
  children
}: SuperCampaignListColumnBaseProps) {
  const classes = useStyles()

  return (
    <div className={classes.root}>
      <Typography className={classes.label} variant="caption" component="span">
        {label}:
      </Typography>
      <Typography variant="body2" component="span">
        {children}
      </Typography>
    </div>
  )
}

export default SuperCampaignListColumnBase
