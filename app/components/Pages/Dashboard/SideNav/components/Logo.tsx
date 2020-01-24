import React from 'react'

import { Box, makeStyles, Theme } from '@material-ui/core'

const WIDTH = 64
const HEIGHT = 64

const useStyles = makeStyles((theme: Theme) => ({
  box: {
    width: WIDTH,
    height: HEIGHT,
    margin: theme.spacing(6, 0, 6, 4)
  },
  image: {
    maxWidth: '100%',
    borderRadius: '50%'
  },
  fallback: {
    display: 'block',
    fontSize: theme.spacing(4),
    textAlign: 'center',
    lineHeight: 2,
    fontWeight: theme.typography.fontWeightBlack,
    borderRadius: '50%',
    color: theme.palette.primary.contrastText,
    backgroundColor: theme.palette.primary.main
  }
}))

interface Props {
  src?: string
}

export default function Logo({ src }: Props) {
  const classes = useStyles()

  return (
    <Box className={classes.box}>
      {src ? (
        <img alt="brand" src={src} className={classes.image} />
      ) : (
        <span className={classes.fallback}>Re</span>
      )}
    </Box>
  )
}
