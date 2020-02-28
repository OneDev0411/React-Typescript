import React from 'react'
import { Avatar, makeStyles } from '@material-ui/core'

const useStyles = makeStyles(theme => ({
  root: {
    width: 50,
    height: 45,
    borderRadius: theme.shape.borderRadius
  }
}))

function ThumbnailColumn({ data }) {
  const classes = useStyles()
  const imageUrl = data.template ? data.template.file.preview_url : null

  return (
    <Avatar
      variant="square"
      sizes={50}
      src={imageUrl}
      className={classes.root}
    />
  )
}

export default ThumbnailColumn
