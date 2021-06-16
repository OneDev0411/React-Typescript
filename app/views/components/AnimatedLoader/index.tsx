import React from 'react'

import { makeStyles, Theme } from '@material-ui/core'

const useStyles = makeStyles(
  (theme: Theme) => ({
    loading: {
      minHeight: '100%',
      height: '100%',
      overflow: 'hidden',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    }
  }),
  {
    name: 'AnimatedLoader'
  }
)

export function AnimatedLoader() {
  const classes = useStyles()

  // Animated SVG is made with https://loading.io/
  // Config:
  // color: #00b286
  // Radius: 11
  // Speed: 1.22
  // Size: 58
  // Transparent: On

  return (
    <div className={classes.loading}>
      <img src="/static/images/bouncing-ball.svg" alt="Loading" />
    </div>
  )
}
