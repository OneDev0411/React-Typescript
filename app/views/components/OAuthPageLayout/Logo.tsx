import React from 'react'

import { Box, makeStyles, Theme } from '@material-ui/core'

const useStyles = makeStyles(
  (theme: Theme) => ({
    brandLogo: {
      width: theme.spacing(10),
      height: theme.spacing(10)
    },
    rechatLogo: {
      width: theme.spacing(20)
    }
  }),
  { name: 'Logo' }
)

interface Props {
  brandLogo?: string
}

export function Logo({ brandLogo }: Props) {
  const alt = 'Rechat'
  const classes = useStyles()

  return (
    <Box mb={4}>
      {brandLogo ? (
        <img src={brandLogo} className={classes.brandLogo} alt={alt} />
      ) : (
        <img
          alt={alt}
          className={classes.rechatLogo}
          src="/static/images/logo.svg"
        />
      )}
    </Box>
  )
}
