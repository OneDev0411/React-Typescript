import React from 'react'

import { Box, makeStyles, Theme } from '@material-ui/core'

const WIDTH = 64
const HEIGHT = 64

const useStyles = makeStyles((theme: Theme) => ({
  box: {
    width: WIDTH,
    height: HEIGHT,
    margin: '3rem 0 3rem 2rem'
  },
  image: {
    maxWidth: '100%',
    borderRadius: '100%'
  },
  fallback: {
    display: 'block',
    fontSize: '2rem',
    textAlign: 'center',
    lineHeight: 2,
    fontWeight: 600,
    borderRadius: '100%',
    color: theme.palette.secondary.contrastText,
    backgroundColor: theme.palette.secondary.main
  }
}))

interface Porps {
  src?: string
}

export default function Logo({ src }: Porps) {
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
