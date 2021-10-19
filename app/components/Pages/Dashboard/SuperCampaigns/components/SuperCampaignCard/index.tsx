import { Card, CardProps, makeStyles } from '@material-ui/core'
import classNames from 'classnames'

const useStyles = makeStyles(
  theme => ({
    root: { padding: theme.spacing(2) }
  }),
  { name: 'SuperCampaignOverviewDetail' }
)

type SuperCampaignCardProps = Omit<CardProps, 'variant'>

function SuperCampaignCard({
  className,
  ...otherProps
}: SuperCampaignCardProps) {
  const classes = useStyles()

  return (
    <Card
      {...otherProps}
      className={classNames(classes.root, className)}
      variant="outlined"
    />
  )
}

export default SuperCampaignCard
