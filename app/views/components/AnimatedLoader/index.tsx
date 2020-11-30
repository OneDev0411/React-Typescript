import React from 'react'

import { makeStyles, Theme } from '@material-ui/core'

const useStyles = makeStyles(
  (theme: Theme) => ({
    '@keyframes pulse': {
      '0%': {
        transform: 'scale(0.7)',
        opacity: 0.9
      },
      '100%': {
        transform: 'scale(1)',
        opacity: 1
      }
    },
    loading: {
      background: theme.palette.grey[50],
      height: '100vh',
      overflow: 'hidden',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      '& img': {
        width: '25%',
        animation: '$pulse 1s'
      }
    }
  }),
  {
    name: 'AnimatedLoader'
  }
)

export function AnimatedLoader() {
  const classes = useStyles()

  return (
    <div className={classes.loading}>
      <img src="/static/images/logo.anim.svg" alt="Rechat Loading" />
    </div>
  )
}
