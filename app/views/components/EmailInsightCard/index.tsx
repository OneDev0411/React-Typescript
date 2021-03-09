import React from 'react'
import {
  Card,
  CardActionArea,
  CardActions,
  CardMedia,
  CardContent,
  Typography,
  Theme,
  makeStyles
} from '@material-ui/core'

import { getHumanReadableExecutionStatus } from './helpers'
import Stats from './Stats'

const useStyles = makeStyles(
  (theme: Theme) => ({
    '@keyframes scrollPositionAnimation': {
      from: {
        objectPosition: '0 0%'
      },
      to: {
        objectPosition: '0 100%'
      }
    },
    card: {
      minHeight: 350
    },
    media: {
      height: 200,
      width: '100%',
      objectFit: 'cover',
      objectPosition: '0 0',
      background: theme.palette.grey[100],
      '&:hover': {
        animation: '8s linear infinite alternate $scrollPositionAnimation'
      }
    }
  }),
  {
    name: 'EmailInsightCard'
  }
)

interface Props {
  campaign: IEmailCampaign<'template'>
}

export default function EmailInsightCard({ campaign }: Props) {
  const classes = useStyles()

  return (
    <Card variant="outlined" className={classes.card}>
      <CardActionArea>
        <CardMedia
          component="img"
          className={classes.media}
          src={
            campaign.template?.file.preview_url ??
            '/static/images/logo--gray.svg'
          }
        />
      </CardActionArea>
      <CardContent>
        <Typography variant="body2">{campaign.subject}</Typography>
        <Typography variant="body2" color="textSecondary">
          {getHumanReadableExecutionStatus(campaign)}
        </Typography>
      </CardContent>
      <CardActions>
        <Stats campaign={campaign} />
      </CardActions>
    </Card>
  )
}
