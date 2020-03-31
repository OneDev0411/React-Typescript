import React from 'react'
import { Box, Typography, Theme } from '@material-ui/core'
import { makeStyles, createStyles } from '@material-ui/styles'

import Brand from '../../../controllers/Brand'

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
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
      width: 72,
      marginBottom: theme.spacing(3)
    }
  })
)

interface Props {
  brand: IBrand
  title: string
  subtitle?: string
}

export default function Header({ brand, title, subtitle }: Props) {
  const classes = useStyles()
  let siteLogo = '/static/images/appicon.png'

  if (brand) {
    siteLogo = Brand.asset('site_logo', null, brand)
  }

  return (
    <Box className={classes.box}>
      <img src={siteLogo} className={classes.logo} alt="logo" />
      <Typography variant="h5">{title}</Typography>
      <Typography variant="subtitle1">{subtitle}</Typography>
    </Box>
  )
}
