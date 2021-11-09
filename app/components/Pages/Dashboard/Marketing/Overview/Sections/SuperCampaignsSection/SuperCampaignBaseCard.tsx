import { ReactNode } from 'react'

import { Card, makeStyles } from '@material-ui/core'
import classNames from 'classnames'

const useStyles = makeStyles(
  {
    actionArea: {
      display: 'flex',
      alignItems: 'stretch'
    },
    imageHolder: {
      position: 'relative',
      overflow: 'hidden',
      flexGrow: 0,
      flexShrink: 0,
      width: '46%'
    },
    details: {
      flexGrow: 1,
      flexShrink: 1,
      overflow: 'hidden',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'space-between'
    }
  },
  { name: 'SuperCampaignBaseCard' }
)

export interface SuperCampaignBaseCardProps {
  className?: string
  children?: ReactNode
  image: ReactNode
}

function SuperCampaignBaseCard({
  className,
  children,
  image
}: SuperCampaignBaseCardProps) {
  const classes = useStyles()

  return (
    <Card
      className={classNames(classes.actionArea, className)}
      variant="outlined"
    >
      <div className={classes.imageHolder}>{image}</div>
      <div className={classes.details}>{children}</div>
    </Card>
  )
}

export default SuperCampaignBaseCard
