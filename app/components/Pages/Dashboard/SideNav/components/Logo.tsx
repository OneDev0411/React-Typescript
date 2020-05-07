import React from 'react'
import { makeStyles, Theme } from '@material-ui/core'

const useStyles = makeStyles(
  (theme: Theme) => ({
    logo: {
      width: theme.spacing(20),
      padding: theme.spacing(5, 3, 3)
    }
  }),
  { name: 'Logo' }
)

export default function Logo() {
  const classes = useStyles()

  return (
    <img
      alt="logo"
      className={classes.logo}
      src="/static/images/logo--white.svg"
    />
  )
}
