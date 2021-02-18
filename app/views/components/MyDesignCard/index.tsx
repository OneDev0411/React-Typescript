import React from 'react'
import {
  Box,
  Card,
  CardActionArea,
  CardMedia,
  CardContent,
  Typography,
  Theme,
  makeStyles
} from '@material-ui/core'
import timeago from 'timeago.js'

import { getTemplateTypeLabel } from 'utils/marketing-center/get-template-type-label'

import { MEDIUM_LABEL_MAP } from '../../../components/Pages/Dashboard/Marketing/constants'

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
  onClick?: () => void
}

export default function MyDesignCard({ templateInstance, onClick }: Props) {
  const classes = useStyles()

  return (
    <Card variant="outlined" className={classes.card} onClick={onClick}>
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
        <Box pt={6}>
          <Typography variant="body2" color="textSecondary">
            {getTemplateTypeLabel(templateInstance.template.template_type)} &gt;{' '}
            {MEDIUM_LABEL_MAP[templateInstance.template.medium] ??
              templateInstance.template.medium}
          </Typography>
        </Box>
      </CardContent>
    </Card>
  )
}
