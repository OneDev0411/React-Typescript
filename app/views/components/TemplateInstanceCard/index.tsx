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
import { getTemplateMediumLabel } from 'utils/marketing-center/get-template-medium-label'

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
    name: 'TemplateInstanceCard'
  }
)

interface Props {
  templateInstance: IMarketingTemplateInstance
  onClick?: () => void
}

export default function TemplateInstanceCard({
  templateInstance,
  onClick
}: Props) {
  const classes = useStyles()

  const templateMediumLabel = getTemplateMediumLabel(
    templateInstance.template.medium
  )

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
        <Typography variant="body2">{templateMediumLabel} Template</Typography>
        <Typography variant="body2" color="textSecondary">
          Created {timeago().format(templateInstance.created_at * 1000)}
        </Typography>
        <Box pt={6}>
          <Typography variant="body2" color="textSecondary">
            {getTemplateTypeLabel(templateInstance.template.template_type)} &gt;{' '}
            {templateMediumLabel}
          </Typography>
        </Box>
      </CardContent>
    </Card>
  )
}
