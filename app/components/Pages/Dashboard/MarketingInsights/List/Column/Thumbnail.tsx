import React from 'react'
import { Avatar, Theme, makeStyles, createStyles } from '@material-ui/core'

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      width: 50,
      height: 45,
      borderRadius: theme.shape.borderRadius
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
    <Avatar
      variant="square"
      sizes="50"
      src={imageUrl}
      className={classes.root}
    />
  )
}

export default ThumbnailColumn
