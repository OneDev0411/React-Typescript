import React from 'react'
import { Box, Typography, Theme } from '@material-ui/core'
import { makeStyles } from '@material-ui/styles'

import Brand from '../../../controllers/Brand'

import Logo from './Logo'

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
    width: theme.spacing(10),
    height: theme.spacing(10),
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
  const siteLogo = brand && Brand.asset('site_logo', '', brand)

  return (
    <Box className={classes.box}>
      {siteLogo ? (
        <img src={siteLogo} className={classes.logo} alt="logo" />
      ) : (
        <Logo />
      )}
      <Typography variant="h4" className={classes.title}>
        {title}
      </Typography>
      <Typography variant="body1">{subtitle}</Typography>
    </Box>
  )
}
