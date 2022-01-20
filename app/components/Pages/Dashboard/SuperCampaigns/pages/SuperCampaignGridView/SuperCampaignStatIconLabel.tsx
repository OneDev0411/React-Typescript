import { Typography, makeStyles } from '@material-ui/core'
import classNames from 'classnames'

import { SvgIcon } from '@app/views/components/SvgIcons/SvgIcon'

const useStyles = makeStyles(
  theme => ({
    root: {
      display: 'inline-flex',
      alignItems: 'center'
    },
    label: { marginLeft: theme.spacing(1) }
  }),
  { name: 'SuperCampaignStatIconLabel' }
)

interface SuperCampaignStatIconLabelProps {
  className: string
  icon: string
  label: string | number
}

function SuperCampaignStatIconLabel({
  className,
  icon,
  label
}: SuperCampaignStatIconLabelProps) {
  const classes = useStyles()

  return (
    <span className={classNames(classes.root, className)}>
      <SvgIcon path={icon} />
      <Typography className={classes.label} variant="body2">
        {label}
      </Typography>
    </span>
  )
}

export default SuperCampaignStatIconLabel
