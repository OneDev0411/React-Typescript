import React from 'react'

import { Box, makeStyles, Theme } from '@material-ui/core'

const useStyles = makeStyles((theme: Theme) => ({
  typeLogo: {
    marginLeft: theme.spacing(1)
  }
}))

export default function Logo() {
  const classes = useStyles()

  return (
    <Box display="flex" alignItems="center" height="40px" mb={5}>
      <img alt="mini-logo" width="40px" src="/static/images/logo--mini.svg" />
      <img
        alt="type-logo"
        className={classes.typeLogo}
        width="108px"
        src="/static/images/logo--type.svg"
      />
    </Box>
  )
}
