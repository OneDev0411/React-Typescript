import { makeStyles, Typography } from '@material-ui/core'
import { mdiLockOutline } from '@mdi/js'
import classNames from 'classnames'

import { muiIconSizes } from '../SvgIcons/icon-sizes'
import { SvgIcon } from '../SvgIcons/SvgIcon'

const useStyles = makeStyles(
  theme => ({
    root: {
      padding: theme.spacing(1.5, 2),
      backgroundColor: theme.palette.grey[100],
      borderRadius: theme.shape.borderRadius
    },
    title: { color: theme.palette.grey[800] },
    description: { color: theme.palette.grey[900] },
    helper: {
      color: theme.palette.grey[500],
      display: 'flex',
      alignItems: 'center'
    },
    helperText: { marginLeft: theme.spacing(0.5) }
  }),
  { name: 'SuperCampaignPreviewDrawerDescription' }
)

interface SuperCampaignPreviewDrawerDescriptionProps {
  className?: string
  description: string
}

function SuperCampaignPreviewDrawerDescription({
  className,
  description
}: SuperCampaignPreviewDrawerDescriptionProps) {
  const classes = useStyles()

  return (
    <div className={classNames(classes.root, className)}>
      <Typography className={classes.title} variant="subtitle2" gutterBottom>
        Campaign Description
      </Typography>
      <Typography className={classes.description} variant="body2" gutterBottom>
        {description}
      </Typography>
      <div className={classes.helper}>
        <SvgIcon path={mdiLockOutline} size={muiIconSizes.small} />
        <Typography className={classes.helperText} variant="caption">
          Only you can see this
        </Typography>
      </div>
    </div>
  )
}

export default SuperCampaignPreviewDrawerDescription
