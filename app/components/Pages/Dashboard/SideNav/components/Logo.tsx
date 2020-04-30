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
    <Box
      display="flex"
      alignItems="center"
      height="24px"
      pt="60px"
      pb={5}
      px={3}
    >
      <img
        alt="mini-logo"
        width="26px"
        src="/static/images/logo--mini--white.svg"
      />
      <img
        alt="type-logo"
        className={classes.typeLogo}
        width="68px"
        src="/static/images/logo--type--white.svg"
      />
    </Box>
  )
}
