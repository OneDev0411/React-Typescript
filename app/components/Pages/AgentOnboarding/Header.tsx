import React from 'react'
import { Box, Typography, Theme } from '@material-ui/core'
import { makeStyles } from '@material-ui/styles'

import Brand from '../../../controllers/Brand'

const useStyles = makeStyles((theme: Theme) => ({
  box: {
    alignItems: 'center',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    maxWidth: '40rem',
    textAlign: 'center',
    marginBottom: theme.spacing(6)
  },
  logo: {
    width: 96,
    height: 96,
    marginBottom: theme.spacing(2)
  },
  title: {
    marginBottom: theme.spacing(2)
  }
}))

interface Props {
  brand?: IBrand | null
  title: string
  subtitle?: string
}

export default function Header({ brand, title, subtitle }: Props) {
  const classes = useStyles()
  let siteLogo = '/static/images/logo.svg'

  if (brand) {
    siteLogo = Brand.asset('site_logo', null, brand)
  }

  return (
    <Box className={classes.box}>
      <img src={siteLogo} className={classes.logo} alt="logo" />
      <Typography variant="h4" className={classes.title}>
        {title}
      </Typography>
      <Typography variant="body1">{subtitle}</Typography>
    </Box>
  )
}
