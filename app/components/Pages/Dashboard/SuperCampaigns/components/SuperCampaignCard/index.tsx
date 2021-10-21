import { Card, CardProps, makeStyles } from '@material-ui/core'
import classNames from 'classnames'

const useStyles = makeStyles(
  theme => ({
    root: { padding: theme.spacing(2) },
    gutterBottom: { marginBottom: theme.spacing(2) }
  }),
  { name: 'SuperCampaignOverviewDetail' }
)

export interface SuperCampaignCardProps extends Omit<CardProps, 'variant'> {
  gutterBottom?: boolean
}

function SuperCampaignCard({
  className,
  gutterBottom,
  ...otherProps
}: SuperCampaignCardProps) {
  const classes = useStyles()

  return (
    <Card
      {...otherProps}
      className={classNames(
        classes.root,
        gutterBottom && classes.gutterBottom,
        className
      )}
      variant="outlined"
    />
  )
}

export default SuperCampaignCard
