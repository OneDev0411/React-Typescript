import { ReactNode } from 'react'

import { Card, makeStyles } from '@material-ui/core'
import classNames from 'classnames'

import LinkCardActionArea, {
  LinkCardActionAreaProps
} from '@app/views/components/LinkCardActionArea'

const useStyles = makeStyles(
  theme => ({
    actionArea: {
      minHeight: theme.spacing(51),
      display: 'flex',
      flexDirection: 'column',
      // TODO: Remove the below block when bootstrap css got removed
      '&:hover, &:focus': {
        color: 'unset',
        textDecoration: 'auto',
        outline: 'unset',
        outlineOffset: 'unset'
      }
    },
    imageHolder: {
      position: 'relative',
      overflow: 'hidden',
      height: theme.spacing(26),
      flexShrink: 0,
      flexGrow: 0,
      width: '100%'
    },
    details: {
      overflow: 'hidden',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'space-between',
      flexShrink: 1,
      flexGrow: 1,
      width: '100%'
    }
  }),
  { name: 'SuperCampaignBaseCard' }
)

export interface SuperCampaignBaseCardProps
  extends Pick<LinkCardActionAreaProps, 'onClick' | 'to'> {
  className?: string
  children?: ReactNode
  image: ReactNode
}

function SuperCampaignBaseCard({
  className,
  children,
  image,
  ...otherProps
}: SuperCampaignBaseCardProps) {
  const classes = useStyles()

  return (
    <Card variant="elevation" elevation={2}>
      <LinkCardActionArea
        {...otherProps}
        className={classNames(classes.actionArea, className)}
      >
        <div className={classes.imageHolder}>{image}</div>
        <div className={classes.details}>{children}</div>
      </LinkCardActionArea>
    </Card>
  )
}

export default SuperCampaignBaseCard
