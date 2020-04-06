import React from 'react'
import classnames from 'classnames'
import { Box, Typography, Theme } from '@material-ui/core'
import { makeStyles, createStyles } from '@material-ui/styles'

import { ClassesProps } from 'utils/ts-utils'

import Brand from '../../../controllers/Brand'

const styles = (theme: Theme) =>
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
      width: 100,
      height: 100,
      marginBottom: theme.spacing(2)
    },
    title: {
      marginBottom: theme.spacing(2)
    }
  })

export interface HeaderProps {
  brand: IBrand
  classes?: ClassesProps<typeof styles>
  className?: string
  subtitle?: string
  title: string
}

const useStyles = makeStyles(styles)

export function Header({ brand, title, ...props }: HeaderProps) {
  const classes = useStyles(props.classes)
  let siteLogo = '/static/images/logo.svg'

  if (brand) {
    siteLogo = Brand.asset('site_logo', null, brand)
  }

  return (
    <Box className={classnames(classes.box, props.className)}>
      <img src={siteLogo} className={classes.logo} alt="logo" />
      <Typography variant="h4" className={classes.title}>
        {title}
      </Typography>
      <Typography variant="body1">{props.subtitle}</Typography>
    </Box>
  )
}

export default Header
