import { ReactNode } from 'react'

import { Card, CardMedia, makeStyles, Typography } from '@material-ui/core'
import classNames from 'classnames'

import SuperCampaignCardDays from './SuperCampaignCardDays'

const useStyles = makeStyles(
  theme => ({
    actionArea: {
      display: 'flex',
      alignItems: 'stretch'
    },
    '@keyframes scrollPositionAnimation': {
      from: {
        objectPosition: '0 0%'
      },
      to: {
        objectPosition: '0 100%'
      }
    },
    imageHolder: {
      position: 'relative',
      overflow: 'hidden',
      flexGrow: 0,
      flexShrink: 0,
      width: '46%'
    },
    media: {
      position: 'absolute',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      objectFit: 'cover',
      objectPosition: '0 0',
      background: theme.palette.grey[100],
      '&:hover': {
        animation: '8s linear infinite alternate $scrollPositionAnimation'
      }
    },
    details: {
      flexGrow: 1,
      flexShrink: 1,
      overflow: 'hidden',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'space-between'
    },
    description: {
      color: theme.palette.grey[700],
      overflow: 'hidden',
      textOverflow: 'ellipsis',
      display: '-webkit-box',
      '-webkit-line-clamp': 2 /* number of lines to show */,
      'line-clamp': 2,
      '-webkit-box-orient': 'vertical'
    },
    margin: {
      display: 'block',
      marginBottom: theme.spacing(0.5)
    },
    padding: { padding: theme.spacing(2) }
  }),
  { name: 'SuperCampaignCard' }
)

export interface SuperCampaignCardProps {
  className?: string
  superCampaign: ISuperCampaign<'template_instance'>
  children?: ReactNode
}

function SuperCampaignCard({
  className,
  superCampaign,
  children
}: SuperCampaignCardProps) {
  const classes = useStyles()

  return (
    <Card
      className={classNames(classes.actionArea, className)}
      variant="outlined"
    >
      <div className={classes.imageHolder}>
        <CardMedia
          component="img"
          className={classes.media}
          src={
            superCampaign.template_instance?.file.preview_url ??
            '/static/images/logo--gray.svg'
          }
        />
      </div>
      <div className={classes.details}>
        <div className={classes.padding}>
          {superCampaign.due_at && (
            <SuperCampaignCardDays
              className={classes.margin}
              time={superCampaign.due_at}
            />
          )}
          <Typography className={classes.margin} variant="subtitle2" noWrap>
            {superCampaign.subject || 'Untitled Campaign'}
          </Typography>
          <Typography variant="body2" className={classes.description}>
            {superCampaign.description}
          </Typography>
        </div>
        {children}
      </div>
    </Card>
  )
}

export default SuperCampaignCard
