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
import timeago from 'timeago.js'

const useStyles = makeStyles(
  (theme: Theme) => ({
    card: {
      minHeight: 350
    },
    media: {
      height: 200,
      width: '100%',
      objectFit: 'contain',
      background: theme.palette.grey[100]
    }
  }),
  {
    name: 'MyDesignCard'
  }
)

interface Props {
  templateInstance: IMarketingTemplateInstance
}

export default function MyDesignCard({ templateInstance }: Props) {
  const classes = useStyles()

  console.log({ templateInstance })

  return (
    <Card variant="outlined" className={classes.card}>
      <CardActionArea>
        <CardMedia
          component="img"
          className={classes.media}
          src={templateInstance.file.preview_url}
        />
      </CardActionArea>
      <CardContent>
        <Typography variant="body2">[Template Name]</Typography>
        <Typography variant="body2" color="textSecondary">
          Created {timeago().format(templateInstance.created_at * 1000)}
        </Typography>
      </CardContent>
      <CardActions>
        <Typography variant="body2" color="textSecondary">
          New Year &gt; Facebook Cover
        </Typography>
      </CardActions>
    </Card>
  )
}
