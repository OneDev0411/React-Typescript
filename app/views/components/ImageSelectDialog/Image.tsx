import React, { HTMLProps } from 'react'
import { Theme, makeStyles } from '@material-ui/core'

const useStyles = makeStyles(
  (theme: Theme) => ({
    image: {
      width: '100%',
      height: 'auto',
      cursor: 'pointer',
      transition: 'all 0.5s',
      '&:hover': {
        background: theme.palette.grey[300]
      }
    }
  }),
  {
    name: 'ImageSelectDialogImage'
  }
)

export default function Image({ src, alt }: HTMLProps<HTMLImageElement>) {
  const classes = useStyles()

  return <img alt={alt} src={src} className={classes.image} />
}
