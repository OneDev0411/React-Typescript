import React from 'react'
import { Avatar, Theme, makeStyles, createStyles } from '@material-ui/core'

import EmailOutline from 'components/SvgIcons/EmailOutline/IconEmailOutline'

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      width: 50,
      height: 50,
      backgroundColor: theme.palette.grey['200'],
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
    <Avatar src={imageUrl} className={classes.root}>
      <EmailOutline />
    </Avatar>
  )
}

export default ThumbnailColumn
