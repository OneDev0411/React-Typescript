import React from 'react'
import { Avatar, Theme, makeStyles, createStyles } from '@material-ui/core'

import EmailOutline from 'components/SvgIcons/EmailOutline/IconEmailOutline'

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      width: 50,
      height: 45,
      backgroundColor: theme.palette.grey['200'],
      borderRadius: theme.shape.borderRadius,
      '& svg': {
        fill: theme.palette.grey['500']
      }
    }
  })
)

interface Props {
  data: IEmailCampaign
}

function ThumbnailColumn({ data }: Props) {
  const classes = useStyles()
  const imageUrl: string | undefined = data.template
    ? data.template.file.preview_url
    : undefined

  return (
    <Avatar variant="square" sizes="50" src={imageUrl} className={classes.root}>
      <EmailOutline />
    </Avatar>
  )
}

export default ThumbnailColumn
